import type { ClientDetail, ClientId, ClientSummary } from './client.types'

export interface ClientRepository {
  listSummaries(): Promise<ClientSummary[]>
  getById(id: ClientId): Promise<ClientDetail | null>
}
