import type { ContractDetail, ContractId, ContractSummary } from './contract.types'

export interface ContractRepository {
  listSummaries(): Promise<ContractSummary[]>
  getById(id: ContractId): Promise<ContractDetail | null>
}
