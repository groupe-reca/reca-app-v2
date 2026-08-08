import type { Database } from '@/infrastructure/supabase/database.types'
import type { ContractDetail, ContractSummary } from '../domain/contract.types'

type ContractRow = Database['public']['Tables']['contracts']['Row']
type ClientRow = Database['public']['Tables']['clients']['Row']

function clientDisplayName(
  client: Pick<ClientRow, 'prenom' | 'nom' | 'entreprise'> | undefined,
): string {
  if (!client) return 'Client inconnu'
  if (client.entreprise) return client.entreprise
  const fullName = `${client.prenom ?? ''} ${client.nom ?? ''}`.trim()
  return fullName.length > 0 ? fullName : 'Client inconnu'
}

export function mapContractRowToSummary(
  row: ContractRow,
  clientsById: Map<string, ClientRow>,
): ContractSummary {
  return {
    id: row.id,
    numero: row.numero,
    clientId: row.client_id,
    clientName: clientDisplayName(clientsById.get(row.client_id)),
    type: row.type,
    saison: row.saison,
    status: row.statut,
    priceCents: row.prix !== null ? Math.round(row.prix * 100) : null,
    dateFin: row.date_fin,
  }
}

export function mapContractRowToDetail(
  row: ContractRow,
  clientsById: Map<string, ClientRow>,
): ContractDetail {
  return {
    ...mapContractRowToSummary(row, clientsById),
    address: row.adresse_geocodee,
    dateSignature: row.date_signature,
    dateDebut: row.date_debut,
    notes: row.notes,
    createdAt: row.created_at,
  }
}
