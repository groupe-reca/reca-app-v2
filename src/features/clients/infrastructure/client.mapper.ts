import type { Database } from '@/infrastructure/supabase/database.types'
import type {
  ClientContractSummary,
  ClientDetail,
  ClientSummary,
} from '../domain/client.types'

type ClientRow = Database['public']['Tables']['clients']['Row']
type ContractRow = Database['public']['Tables']['contracts']['Row']

function displayName(row: Pick<ClientRow, 'prenom' | 'nom' | 'entreprise'>): string {
  if (row.entreprise) return row.entreprise
  const fullName = `${row.prenom ?? ''} ${row.nom ?? ''}`.trim()
  return fullName.length > 0 ? fullName : 'Client sans nom'
}

export function mapClientRowToSummary(row: ClientRow): ClientSummary {
  return {
    id: row.id,
    numero: row.numero,
    displayName: displayName(row),
    isCompany: row.entreprise !== null,
    phone: row.telephone,
    email: row.courriel,
    city: row.ville,
    status: row.statut,
  }
}

function mapContract(row: ContractRow): ClientContractSummary {
  return {
    id: row.id,
    numero: row.numero,
    type: row.type,
    saison: row.saison,
    status: row.statut,
    priceCents: row.prix !== null ? Math.round(row.prix * 100) : null,
    dateFin: row.date_fin,
  }
}

export function mapClientRowToDetail(
  row: ClientRow,
  contracts: ContractRow[],
): ClientDetail {
  return {
    ...mapClientRowToSummary(row),
    address: row.adresse,
    postalCode: row.code_postal,
    notes: row.notes,
    createdAt: row.created_at,
    contracts: contracts.map(mapContract),
  }
}
