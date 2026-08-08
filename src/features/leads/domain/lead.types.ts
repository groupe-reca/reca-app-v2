import type { LeadStatus } from '@/domain/leadStatus'

export type LeadId = string

export interface LeadSummary {
  id: LeadId
  numero: string | null
  displayName: string
  phone: string | null
  email: string | null
  typeService: string | null
  status: LeadStatus
  createdAt: string
}

export interface LeadDetail extends LeadSummary {
  address: string | null
  city: string | null
  message: string | null
  source: string | null
  reminderAt: string | null
  reminderNote: string | null
}

export interface CreateLeadInput {
  prenom: string
  nom: string
  telephone?: string
  courriel?: string
  adresse?: string
  ville?: string
  typeService?: string
  message?: string
  source?: string
}
