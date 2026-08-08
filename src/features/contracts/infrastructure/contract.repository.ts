import { supabase } from '@/infrastructure/supabase/client'
import type { ContractRepository } from '../domain/contract.repository'
import type {
  ContractDetail,
  ContractId,
  ContractSummary,
} from '../domain/contract.types'
import { mapContractRowToDetail, mapContractRowToSummary } from './contract.mapper'

function uniqueDefined<T>(values: (T | null | undefined)[]): T[] {
  return [
    ...new Set(
      values.filter((value): value is T => value !== null && value !== undefined),
    ),
  ]
}

export class SupabaseContractRepository implements ContractRepository {
  async listSummaries(): Promise<ContractSummary[]> {
    const { data: contracts, error } = await supabase
      .from('contracts')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error

    const clientsResult = await supabase
      .from('clients')
      .select('*')
      .in('id', uniqueDefined(contracts.map((c) => c.client_id)))
    if (clientsResult.error) throw clientsResult.error

    const clientsById = new Map(clientsResult.data.map((c) => [c.id, c]))
    return contracts.map((row) => mapContractRowToSummary(row, clientsById))
  }

  async getById(id: ContractId): Promise<ContractDetail | null> {
    const { data: contract, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) throw error
    if (!contract) return null

    const clientsResult = await supabase
      .from('clients')
      .select('*')
      .eq('id', contract.client_id)
    if (clientsResult.error) throw clientsResult.error

    return mapContractRowToDetail(
      contract,
      new Map(clientsResult.data.map((c) => [c.id, c])),
    )
  }
}
