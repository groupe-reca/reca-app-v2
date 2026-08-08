import type { InvoiceStatus } from '@/domain/invoiceStatus'
import type {
  CreateInvoiceInput,
  InvoiceDetail,
  InvoiceId,
  InvoiceSummary,
  UpdateInvoiceInput,
} from './invoice.types'

export interface InvoiceRepository {
  listSummaries(): Promise<InvoiceSummary[]>
  getById(id: InvoiceId): Promise<InvoiceDetail | null>
  create(input: CreateInvoiceInput): Promise<InvoiceId>
  update(id: InvoiceId, input: UpdateInvoiceInput): Promise<void>
  updateStatus(id: InvoiceId, status: InvoiceStatus): Promise<void>
}
