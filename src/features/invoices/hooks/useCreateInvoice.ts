import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { CreateInvoiceInput } from '../domain/invoice.types'
import { invoiceKeys } from './invoiceKeys'

export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateInvoiceInput) => dependencies.invoiceRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.list() })
    },
  })
}
