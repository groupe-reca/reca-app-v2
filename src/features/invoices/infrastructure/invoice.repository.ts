import { supabase } from '@/infrastructure/supabase/client'
import type { Database } from '@/infrastructure/supabase/database.types'
import type { InvoiceStatus } from '@/domain/invoiceStatus'
import type { InvoiceRepository } from '../domain/invoice.repository'
import type {
  CreateInvoiceInput,
  InvoiceDetail,
  InvoiceId,
  InvoiceSummary,
  UpdateInvoiceInput,
} from '../domain/invoice.types'
import { mapInvoiceRowToSummary } from './invoice.mapper'

type InvoiceRow = Database['public']['Tables']['invoices']['Row']
type ClientRow = Database['public']['Tables']['clients']['Row']
type ContractRow = Database['public']['Tables']['contracts']['Row']

// NOTE: separate per-table queries rather than an embedded select — see
// mission.repository.ts / quote.repository.ts for why (hand-written
// Database type has no Relationships metadata).
function uniqueDefined<T>(values: (T | null | undefined)[]): T[] {
  return [...new Set(values.filter((value): value is T => value !== null && value !== undefined))]
}

async function fetchClientsByIds(ids: string[]): Promise<Map<string, ClientRow>> {
  if (ids.length === 0) return new Map()
  const { data, error } = await supabase.from('clients').select('*').in('id', ids)
  if (error) throw error
  return new Map(data.map((row) => [row.id, row]))
}

async function fetchContractsByIds(ids: string[]): Promise<Map<string, ContractRow>> {
  if (ids.length === 0) return new Map()
  const { data, error } = await supabase.from('contracts').select('*').in('id', ids)
  if (error) throw error
  return new Map(data.map((row) => [row.id, row]))
}

async function hydrateSummaries(rows: InvoiceRow[]): Promise<InvoiceSummary[]> {
  const [clientsById, contractsById] = await Promise.all([
    fetchClientsByIds(uniqueDefined(rows.map((row) => row.client_id))),
    fetchContractsByIds(uniqueDefined(rows.map((row) => row.contrat_id))),
  ])
  return rows.map((row) =>
    mapInvoiceRowToSummary(
      row,
      clientsById.get(row.client_id),
      row.contrat_id ? contractsById.get(row.contrat_id) : undefined,
    ),
  )
}

export class SupabaseInvoiceRepository implements InvoiceRepository {
  async listSummaries(): Promise<InvoiceSummary[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return hydrateSummaries(data)
  }

  async getById(id: InvoiceId): Promise<InvoiceDetail | null> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    const summaries = await hydrateSummaries([data])
    return summaries[0] ?? null
  }

  async create(input: CreateInvoiceInput): Promise<InvoiceId> {
    const sousTotal = input.subtotalCents / 100
    const tps = input.tpsCents / 100
    const tvq = input.tvqCents / 100
    const total = sousTotal + tps + tvq
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        client_id: input.clientId,
        contrat_id: input.contractId ?? null,
        date: input.date,
        sous_total: sousTotal,
        tps,
        tvq,
        total,
        solde: total,
      })
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }

  async update(id: InvoiceId, input: UpdateInvoiceInput): Promise<void> {
    const sousTotal = input.subtotalCents / 100
    const tps = input.tpsCents / 100
    const tvq = input.tvqCents / 100
    const total = sousTotal + tps + tvq
    const { error } = await supabase
      .from('invoices')
      .update({ date: input.date, sous_total: sousTotal, tps, tvq, total })
      .eq('id', id)
    if (error) throw error
  }

  async updateStatus(id: InvoiceId, status: InvoiceStatus): Promise<void> {
    const { error } = await supabase.from('invoices').update({ statut: status }).eq('id', id)
    if (error) throw error
  }
}
