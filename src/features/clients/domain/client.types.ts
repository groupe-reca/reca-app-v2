import type { ClientStatus, ContractStatus } from '@/domain/clientStatus'

export type ClientId = string

export interface ClientSummary {
  id: ClientId
  numero: string | null
  displayName: string
  isCompany: boolean
  phone: string | null
  email: string | null
  city: string | null
  status: ClientStatus
}

export interface ClientContractSummary {
  id: string
  numero: string | null
  type: string | null
  saison: string | null
  status: ContractStatus
  priceCents: number | null
  dateFin: string | null
}

export interface ClientDetail extends ClientSummary {
  address: string | null
  postalCode: string | null
  notes: string | null
  createdAt: string
  contracts: ClientContractSummary[]
}
