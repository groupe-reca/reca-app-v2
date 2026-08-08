import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { InvoiceId } from '../domain/invoice.types'
import { invoiceKeys } from './invoiceKeys'

export function useInvoice(id: InvoiceId | undefined) {
  return useQuery({
    queryKey: invoiceKeys.detail(id ?? ''),
    queryFn: () => dependencies.invoiceRepository.getById(id ?? ''),
    enabled: Boolean(id),
  })
}
