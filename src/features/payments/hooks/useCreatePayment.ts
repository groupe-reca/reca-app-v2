import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { invoiceKeys } from '@/features/invoices/hooks/invoiceKeys'
import type { CreatePaymentInput } from '../domain/payment.types'
import { paymentKeys } from './paymentKeys'

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreatePaymentInput) => dependencies.paymentRepository.create(input),
    onSuccess: (_id, input) => {
      void queryClient.invalidateQueries({ queryKey: paymentKeys.list() })
      void queryClient.invalidateQueries({ queryKey: paymentKeys.byInvoice(input.invoiceId) })
      // Recording a payment changes the linked invoice's solde/statut
      // (see recalcInvoiceBalance in payment.repository.ts) — invalidate
      // it too, a cross-feature invalidation since Payments is
      // downstream of Invoices.
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(input.invoiceId) })
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.list() })
    },
  })
}
