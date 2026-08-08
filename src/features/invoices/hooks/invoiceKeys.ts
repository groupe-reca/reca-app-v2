import type { InvoiceId } from '../domain/invoice.types'

export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: () => [...invoiceKeys.lists()] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: InvoiceId) => [...invoiceKeys.details(), id] as const,
}
