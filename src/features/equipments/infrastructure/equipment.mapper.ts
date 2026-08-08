import type { Database } from '@/infrastructure/supabase/database.types'
import type { EquipmentDetail, EquipmentSummary } from '../domain/equipment.types'

type EquipmentRow = Database['public']['Tables']['equipments']['Row']

export function mapEquipmentRowToSummary(row: EquipmentRow): EquipmentSummary {
  return {
    id: row.id,
    numero: row.numero,
    nom: row.nom,
    categorie: row.categorie,
    status: row.statut,
  }
}

export function mapEquipmentRowToDetail(row: EquipmentRow): EquipmentDetail {
  return {
    ...mapEquipmentRowToSummary(row),
    marque: row.marque,
    modele: row.modele,
    annee: row.annee,
    plaque: row.plaque,
    numeroSerie: row.numero_serie,
    entretien: row.entretien,
    notes: row.notes,
    createdAt: row.created_at,
  }
}
