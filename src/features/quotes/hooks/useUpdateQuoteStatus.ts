import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { QuoteStatus } from '@/domain/quoteStatus'
import type { QuoteId } from '../domain/quote.types'
import { quoteKeys } from './quoteKeys'

export function useUpdateQuoteStatus(id: QuoteId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: QuoteStatus) => dependencies.quoteRepository.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: quoteKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: quoteKeys.list() })
    },
  })
}
