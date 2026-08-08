import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { CreateQuoteInput } from '../domain/quote.types'
import { quoteKeys } from './quoteKeys'

export function useCreateQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateQuoteInput) => dependencies.quoteRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: quoteKeys.list() })
    },
  })
}
