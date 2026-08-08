import type { Database } from '@/infrastructure/supabase/database.types'
import type { EmployeeDetail, EmployeeSummary } from '../domain/employee.types'

type EmployeeRow = Database['public']['Tables']['employees']['Row']

export function mapEmployeeRowToSummary(row: EmployeeRow): EmployeeSummary {
  return {
    id: row.id,
    displayName: `${row.prenom} ${row.nom}`.trim(),
    phone: row.telephone,
    email: row.courriel,
    poste: row.poste,
    role: row.role,
    active: row.actif,
  }
}

export function mapEmployeeRowToDetail(row: EmployeeRow): EmployeeDetail {
  return {
    ...mapEmployeeRowToSummary(row),
    dateEmbauche: row.date_embauche,
    notes: row.notes,
    createdAt: row.created_at,
  }
}
