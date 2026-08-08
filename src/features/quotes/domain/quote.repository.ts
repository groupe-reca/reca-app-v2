import type { QuoteStatus } from '@/domain/quoteStatus'
import type {
  CreateQuoteInput,
  QuoteDetail,
  QuoteId,
  QuoteSummary,
  UpdateQuoteInput,
} from './quote.types'

export interface QuoteRepository {
  listSummaries(): Promise<QuoteSummary[]>
  getById(id: QuoteId): Promise<QuoteDetail | null>
  create(input: CreateQuoteInput): Promise<QuoteId>
  update(id: QuoteId, input: UpdateQuoteInput): Promise<void>
  updateStatus(id: QuoteId, status: QuoteStatus): Promise<void>
  linkToClient(id: QuoteId, clientId: string): Promise<void>
}
