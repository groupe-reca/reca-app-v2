import type { QuoteStatus } from '@/domain/quoteStatus'
import type { MoneyCents } from '@/domain/money'

export type QuoteId = string

export interface QuoteSummary {
  id: QuoteId
  numero: string | null
  status: QuoteStatus
  amountCents: MoneyCents
  taxesCents: MoneyCents
  totalCents: MoneyCents
  expiration: string | null
  createdAt: string
  leadId: string | null
  leadDisplayName: string | null
  clientId: string | null
  clientDisplayName: string | null
}

export interface QuoteDetail extends QuoteSummary {
  notes: string | null
}

export interface CreateQuoteInput {
  leadId?: string
  amountCents: MoneyCents
  taxesCents: MoneyCents
  expiration?: string
  notes?: string
}

export interface UpdateQuoteInput {
  amountCents: MoneyCents
  taxesCents: MoneyCents
  expiration?: string
  notes?: string
}
