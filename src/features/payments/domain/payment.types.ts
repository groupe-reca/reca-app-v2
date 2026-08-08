import type { MoneyCents } from '@/domain/money'

export type PaymentId = string

export interface PaymentSummary {
  id: PaymentId
  invoiceId: string
  invoiceNumero: string | null
  amountCents: MoneyCents
  method: string | null
  reference: string | null
  date: string
  notes: string | null
}

export interface CreatePaymentInput {
  invoiceId: string
  amountCents: MoneyCents
  method?: string
  reference?: string
  date: string
  notes?: string
}
