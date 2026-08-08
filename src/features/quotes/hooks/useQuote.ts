import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { QuoteId } from '../domain/quote.types'
import { quoteKeys } from './quoteKeys'

export function useQuote(id: QuoteId | undefined) {
  return useQuery({
    queryKey: quoteKeys.detail(id ?? ''),
    queryFn: () => dependencies.quoteRepository.getById(id ?? ''),
    enabled: Boolean(id),
  })
}
