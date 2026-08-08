import { supabase } from '@/infrastructure/supabase/client'
import type { Database } from '@/infrastructure/supabase/database.types'
import type { PaymentRepository } from '../domain/payment.repository'
import type { CreatePaymentInput, PaymentId, PaymentSummary } from '../domain/payment.types'
import { mapPaymentRowToSummary } from './payment.mapper'

type PaymentRow = Database['public']['Tables']['payments']['Row']
type InvoiceRow = Database['public']['Tables']['invoices']['Row']

function uniqueDefined<T>(values: (T | null | undefined)[]): T[] {
  return [...new Set(values.filter((value): value is T => value !== null && value !== undefined))]
}

async function fetchInvoicesByIds(ids: string[]): Promise<Map<string, InvoiceRow>> {
  if (ids.length === 0) return new Map()
  const { data, error } = await supabase.from('invoices').select('*').in('id', ids)
  if (error) throw error
  return new Map(data.map((row) => [row.id, row]))
}

async function hydrateSummaries(rows: PaymentRow[]): Promise<PaymentSummary[]> {
  const invoicesById = await fetchInvoicesByIds(uniqueDefined(rows.map((row) => row.facture_id)))
  return rows.map((row) => mapPaymentRowToSummary(row, invoicesById.get(row.facture_id)))
}

// Mirrors reca-app's real payments.service.ts#recalcInvoiceBalance: not
// a Postgres RPC/transaction, just a plain sequence of client calls
// (sum non-deleted payments, then update the invoice) — matched
// exactly rather than "fixed" into a transactional RPC, since the docs'
// aspirational RecordPayment example isn't how the reference app
// actually implements this (see memory.md "Payments module").
async function recalcInvoiceBalance(invoiceId: string): Promise<void> {
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single()
  if (invoiceError) throw invoiceError

  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('montant')
    .eq('facture_id', invoiceId)
    .is('deleted_at', null)
  if (paymentsError) throw paymentsError

  const totalPaid = payments.reduce((sum, payment) => sum + payment.montant, 0)
  const solde = invoice.total - totalPaid

  let statut: InvoiceRow['statut'] = invoice.statut
  if (totalPaid <= 0) {
    if (statut === 'payee' || statut === 'partiellement_payee') {
      statut = 'envoyee'
    }
  } else if (solde <= 0) {
    statut = 'payee'
  } else {
    statut = 'partiellement_payee'
  }

  const { error: updateError } = await supabase
    .from('invoices')
    .update({ solde, statut })
    .eq('id', invoiceId)
  if (updateError) throw updateError
}

export class SupabasePaymentRepository implements PaymentRepository {
  async listSummaries(): Promise<PaymentSummary[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return hydrateSummaries(data)
  }

  async listByInvoice(invoiceId: string): Promise<PaymentSummary[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('facture_id', invoiceId)
      .is('deleted_at', null)
      .order('date', { ascending: false })
    if (error) throw error
    return hydrateSummaries(data)
  }

  async create(input: CreatePaymentInput): Promise<PaymentId> {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        facture_id: input.invoiceId,
        montant: input.amountCents / 100,
        methode: input.method ?? null,
        reference: input.reference ?? null,
        date: input.date,
        notes: input.notes ?? null,
      })
      .select('id')
      .single()
    if (error) throw error

    await recalcInvoiceBalance(input.invoiceId)

    return data.id
  }
}
