import type { Database } from '@/infrastructure/supabase/database.types'
import type { PaymentSummary } from '../domain/payment.types'

type PaymentRow = Database['public']['Tables']['payments']['Row']
type InvoiceRow = Database['public']['Tables']['invoices']['Row']

export function mapPaymentRowToSummary(
  row: PaymentRow,
  invoice: InvoiceRow | undefined,
): PaymentSummary {
  return {
    id: row.id,
    invoiceId: row.facture_id,
    invoiceNumero: invoice?.numero ?? null,
    amountCents: Math.round(row.montant * 100),
    method: row.methode,
    reference: row.reference,
    date: row.date,
    notes: row.notes,
  }
}
