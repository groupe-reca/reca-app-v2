import type { LeadStatus } from '@/domain/leadStatus'
import type { CreateLeadInput, LeadDetail, LeadId, LeadSummary } from './lead.types'

export interface LeadRepository {
  listSummaries(): Promise<LeadSummary[]>
  getById(id: LeadId): Promise<LeadDetail | null>
  updateStatus(id: LeadId, status: LeadStatus): Promise<void>
  create(input: CreateLeadInput): Promise<LeadId>
}
