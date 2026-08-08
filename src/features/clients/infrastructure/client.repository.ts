import { supabase } from '@/infrastructure/supabase/client'
import type { ClientRepository } from '../domain/client.repository'
import type { ClientDetail, ClientId, ClientSummary } from '../domain/client.types'
import { mapClientRowToDetail, mapClientRowToSummary } from './client.mapper'

export class SupabaseClientRepository implements ClientRepository {
  async listSummaries(): Promise<ClientSummary[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return data.map(mapClientRowToSummary)
  }

  async getById(id: ClientId): Promise<ClientDetail | null> {
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) throw error
    if (!client) return null

    const { data: contracts, error: contractsError } = await supabase
      .from('contracts')
      .select('*')
      .eq('client_id', id)
      .is('deleted_at', null)
      .order('date_fin', { ascending: false })
    if (contractsError) throw contractsError

    return mapClientRowToDetail(client, contracts)
  }
}
