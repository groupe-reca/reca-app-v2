import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { paymentKeys } from './paymentKeys'

export function usePayments() {
  return useQuery({
    queryKey: paymentKeys.list(),
    queryFn: () => dependencies.paymentRepository.listSummaries(),
  })
}
