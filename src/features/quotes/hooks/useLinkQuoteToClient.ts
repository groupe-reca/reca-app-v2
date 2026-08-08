import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { QuoteId } from '../domain/quote.types'
import { quoteKeys } from './quoteKeys'

export function useLinkQuoteToClient(id: QuoteId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (clientId: string) => dependencies.quoteRepository.linkToClient(id, clientId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: quoteKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: quoteKeys.list() })
    },
  })
}
