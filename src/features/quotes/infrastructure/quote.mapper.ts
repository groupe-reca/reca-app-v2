import type { Database } from '@/infrastructure/supabase/database.types'
import type { QuoteDetail, QuoteSummary } from '../domain/quote.types'

type QuoteRow = Database['public']['Tables']['quotes']['Row']
type LeadRow = Database['public']['Tables']['leads']['Row']
type ClientRow = Database['public']['Tables']['clients']['Row']

function leadDisplayName(row: Pick<LeadRow, 'prenom' | 'nom'> | undefined): string | null {
  if (!row) return null
  const fullName = `${row.prenom} ${row.nom}`.trim()
  return fullName.length > 0 ? fullName : null
}

function clientDisplayName(
  row: Pick<ClientRow, 'prenom' | 'nom' | 'entreprise'> | undefined,
): string | null {
  if (!row) return null
  if (row.entreprise) return row.entreprise
  const fullName = `${row.prenom ?? ''} ${row.nom ?? ''}`.trim()
  return fullName.length > 0 ? fullName : null
}

export function mapQuoteRowToSummary(
  row: QuoteRow,
  lead: LeadRow | undefined,
  client: ClientRow | undefined,
): QuoteSummary {
  return {
    id: row.id,
    numero: row.numero,
    status: row.statut,
    amountCents: Math.round(row.montant * 100),
    taxesCents: Math.round(row.taxes * 100),
    totalCents: Math.round(row.total * 100),
    expiration: row.expiration,
    createdAt: row.created_at,
    leadId: row.lead_id,
    leadDisplayName: leadDisplayName(lead),
    clientId: row.client_id,
    clientDisplayName: clientDisplayName(client),
  }
}

export function mapQuoteRowToDetail(
  row: QuoteRow,
  lead: LeadRow | undefined,
  client: ClientRow | undefined,
): QuoteDetail {
  return {
    ...mapQuoteRowToSummary(row, lead, client),
    notes: row.notes,
  }
}
