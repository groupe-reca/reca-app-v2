import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { invoiceKeys } from './invoiceKeys'

export function useInvoices() {
  return useQuery({
    queryKey: invoiceKeys.list(),
    queryFn: () => dependencies.invoiceRepository.listSummaries(),
  })
}
