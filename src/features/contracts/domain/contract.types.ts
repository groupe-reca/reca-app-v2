import type { ContractStatus } from '@/domain/clientStatus'

export type ContractId = string

export interface ContractSummary {
  id: ContractId
  numero: string | null
  clientId: string
  clientName: string
  type: string | null
  saison: string | null
  status: ContractStatus
  priceCents: number | null
  dateFin: string | null
}

export interface ContractDetail extends ContractSummary {
  address: string | null
  dateSignature: string | null
  dateDebut: string | null
  notes: string | null
  createdAt: string
}
