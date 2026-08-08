import type { CreatePaymentInput, PaymentId, PaymentSummary } from './payment.types'

export interface PaymentRepository {
  listSummaries(): Promise<PaymentSummary[]>
  listByInvoice(invoiceId: string): Promise<PaymentSummary[]>
  create(input: CreatePaymentInput): Promise<PaymentId>
}
