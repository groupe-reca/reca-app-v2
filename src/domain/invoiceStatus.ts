import type { StatusTone } from '@/components/ui/StatusBadge'

// Real DB values + labels/tones, cross-checked against reca-app's
// InvoiceStatusBadge.tsx and invoice.types.ts — no anti-corruption
// mapping needed.
export type InvoiceStatus =
  | 'brouillon'
  | 'envoyee'
  | 'payee'
  | 'partiellement_payee'
  | 'en_retard'
  | 'annulee'

export const invoiceStatusMeta: Record<InvoiceStatus, { label: string; tone: StatusTone }> = {
  brouillon: { label: 'Brouillon', tone: 'neutral' },
  envoyee: { label: 'Envoyée', tone: 'info' },
  payee: { label: 'Payée', tone: 'success' },
  partiellement_payee: { label: 'Partiellement payée', tone: 'warning' },
  en_retard: { label: 'En retard', tone: 'danger' },
  annulee: { label: 'Annulée', tone: 'danger' },
}

export const invoiceStatusOrder: InvoiceStatus[] = [
  'brouillon',
  'envoyee',
  'payee',
  'partiellement_payee',
  'en_retard',
  'annulee',
]

// reca-app's real PAYMENT_METHODS constant — free text on payments.methode,
// this is a frontend-only suggested list.
export const paymentMethods = ['Interac', 'Comptant', 'Chèque', 'Virement', 'Carte'] as const
