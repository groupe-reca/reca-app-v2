import type { ContractStatus } from '@/domain/clientStatus'

export type RouteId = string

export interface RouteSummary {
  id: RouteId
  nom: string
  couleur: string
  operatorName: string | null
  equipmentName: string | null
  contractCount: number
}

export interface RouteContractDetail {
  id: string
  ordre: number
  contractId: string
  contractNumero: string | null
  address: string | null
  status: ContractStatus
}

export interface RouteDetail extends RouteSummary {
  contracts: RouteContractDetail[]
}
