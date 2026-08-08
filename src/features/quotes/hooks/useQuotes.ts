import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { quoteKeys } from './quoteKeys'

export function useQuotes() {
  return useQuery({
    queryKey: quoteKeys.list(),
    queryFn: () => dependencies.quoteRepository.listSummaries(),
  })
}
