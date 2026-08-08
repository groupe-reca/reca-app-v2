import type { InvoiceStatus } from '@/domain/invoiceStatus'
import type { MoneyCents } from '@/domain/money'

export type InvoiceId = string

export interface InvoiceSummary {
  id: InvoiceId
  numero: string | null
  status: InvoiceStatus
  date: string
  subtotalCents: MoneyCents
  tpsCents: MoneyCents
  tvqCents: MoneyCents
  totalCents: MoneyCents
  balanceCents: MoneyCents
  clientId: string
  clientDisplayName: string | null
  contractId: string | null
  contractNumero: string | null
}

export type InvoiceDetail = InvoiceSummary

export interface CreateInvoiceInput {
  clientId: string
  contractId?: string
  date: string
  subtotalCents: MoneyCents
  tpsCents: MoneyCents
  tvqCents: MoneyCents
}

export interface UpdateInvoiceInput {
  date: string
  subtotalCents: MoneyCents
  tpsCents: MoneyCents
  tvqCents: MoneyCents
}
