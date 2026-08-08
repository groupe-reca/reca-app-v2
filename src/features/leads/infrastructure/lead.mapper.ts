import type { Database } from '@/infrastructure/supabase/database.types'
import type { LeadDetail, LeadSummary } from '../domain/lead.types'

type LeadRow = Database['public']['Tables']['leads']['Row']

export function mapLeadRowToSummary(row: LeadRow): LeadSummary {
  return {
    id: row.id,
    numero: row.numero,
    displayName: `${row.prenom} ${row.nom}`.trim(),
    phone: row.telephone,
    email: row.courriel,
    typeService: row.type_service,
    status: row.statut,
    createdAt: row.created_at,
  }
}

export function mapLeadRowToDetail(row: LeadRow): LeadDetail {
  return {
    ...mapLeadRowToSummary(row),
    address: row.adresse,
    city: row.ville,
    message: row.message,
    source: row.source,
    reminderAt: row.rappel_le,
    reminderNote: row.rappel_note,
  }
}
