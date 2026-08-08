import { supabase } from '@/infrastructure/supabase/client'
import type { Database } from '@/infrastructure/supabase/database.types'
import type { QuoteStatus } from '@/domain/quoteStatus'
import type { QuoteRepository } from '../domain/quote.repository'
import type {
  CreateQuoteInput,
  QuoteDetail,
  QuoteId,
  QuoteSummary,
  UpdateQuoteInput,
} from '../domain/quote.types'
import { mapQuoteRowToDetail, mapQuoteRowToSummary } from './quote.mapper'

type QuoteRow = Database['public']['Tables']['quotes']['Row']
type LeadRow = Database['public']['Tables']['leads']['Row']
type ClientRow = Database['public']['Tables']['clients']['Row']

// NOTE: separate per-table queries rather than an embedded select — see
// mission.repository.ts for why (hand-written Database type has no
// Relationships metadata for supabase-js to type embeds safely).
function uniqueDefined<T>(values: (T | null | undefined)[]): T[] {
  return [...new Set(values.filter((value): value is T => value !== null && value !== undefined))]
}

async function fetchLeadsByIds(ids: string[]): Promise<Map<string, LeadRow>> {
  if (ids.length === 0) return new Map()
  const { data, error } = await supabase.from('leads').select('*').in('id', ids)
  if (error) throw error
  return new Map(data.map((row) => [row.id, row]))
}

async function fetchClientsByIds(ids: string[]): Promise<Map<string, ClientRow>> {
  if (ids.length === 0) return new Map()
  const { data, error } = await supabase.from('clients').select('*').in('id', ids)
  if (error) throw error
  return new Map(data.map((row) => [row.id, row]))
}

async function hydrateSummaries(rows: QuoteRow[]): Promise<QuoteSummary[]> {
  const [leadsById, clientsById] = await Promise.all([
    fetchLeadsByIds(uniqueDefined(rows.map((row) => row.lead_id))),
    fetchClientsByIds(uniqueDefined(rows.map((row) => row.client_id))),
  ])
  return rows.map((row) =>
    mapQuoteRowToSummary(
      row,
      row.lead_id ? leadsById.get(row.lead_id) : undefined,
      row.client_id ? clientsById.get(row.client_id) : undefined,
    ),
  )
}

export class SupabaseQuoteRepository implements QuoteRepository {
  async listSummaries(): Promise<QuoteSummary[]> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return hydrateSummaries(data)
  }

  async getById(id: QuoteId): Promise<QuoteDetail | null> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) throw error
    if (!data) return null

    const [lead, client] = await Promise.all([
      data.lead_id
        ? supabase.from('leads').select('*').eq('id', data.lead_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      data.client_id
        ? supabase.from('clients').select('*').eq('id', data.client_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ])
    if (lead.error) throw lead.error
    if (client.error) throw client.error

    return mapQuoteRowToDetail(data, lead.data ?? undefined, client.data ?? undefined)
  }

  async create(input: CreateQuoteInput): Promise<QuoteId> {
    const montant = input.amountCents / 100
    const taxes = input.taxesCents / 100
    const { data, error } = await supabase
      .from('quotes')
      .insert({
        lead_id: input.leadId ?? null,
        montant,
        taxes,
        total: montant + taxes,
        expiration: input.expiration ?? null,
        notes: input.notes ?? null,
      })
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }

  async update(id: QuoteId, input: UpdateQuoteInput): Promise<void> {
    const montant = input.amountCents / 100
    const taxes = input.taxesCents / 100
    const { error } = await supabase
      .from('quotes')
      .update({
        montant,
        taxes,
        total: montant + taxes,
        expiration: input.expiration ?? null,
        notes: input.notes ?? null,
      })
      .eq('id', id)
    if (error) throw error
  }

  async updateStatus(id: QuoteId, status: QuoteStatus): Promise<void> {
    const { error } = await supabase.from('quotes').update({ statut: status }).eq('id', id)
    if (error) throw error
  }

  async linkToClient(id: QuoteId, clientId: string): Promise<void> {
    const { error } = await supabase
      .from('quotes')
      .update({ client_id: clientId, statut: 'acceptee' })
      .eq('id', id)
    if (error) throw error
  }
}
