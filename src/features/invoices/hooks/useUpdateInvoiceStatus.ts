import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { InvoiceStatus } from '@/domain/invoiceStatus'
import type { InvoiceId } from '../domain/invoice.types'
import { invoiceKeys } from './invoiceKeys'

export function useUpdateInvoiceStatus(id: InvoiceId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: InvoiceStatus) => dependencies.invoiceRepository.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.list() })
    },
  })
}
