export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: () => [...paymentKeys.lists()] as const,
  byInvoice: (invoiceId: string) => [...paymentKeys.all, 'byInvoice', invoiceId] as const,
}
