import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { paymentKeys } from './paymentKeys'

export function usePaymentsByInvoice(invoiceId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.byInvoice(invoiceId ?? ''),
    queryFn: () => dependencies.paymentRepository.listByInvoice(invoiceId ?? ''),
    enabled: Boolean(invoiceId),
  })
}
