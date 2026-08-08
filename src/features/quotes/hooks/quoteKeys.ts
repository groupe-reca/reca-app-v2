import type { QuoteId } from '../domain/quote.types'

export const quoteKeys = {
  all: ['quotes'] as const,
  lists: () => [...quoteKeys.all, 'list'] as const,
  list: () => [...quoteKeys.lists()] as const,
  details: () => [...quoteKeys.all, 'detail'] as const,
  detail: (id: QuoteId) => [...quoteKeys.details(), id] as const,
}
