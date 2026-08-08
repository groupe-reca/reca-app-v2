import { supabase } from '@/infrastructure/supabase/client'
import type { EquipmentStatus } from '@/domain/equipmentStatus'
import type { EquipmentRepository } from '../domain/equipment.repository'
import type {
  CreateEquipmentInput,
  EquipmentDetail,
  EquipmentId,
  EquipmentSummary,
  UpdateEquipmentInput,
} from '../domain/equipment.types'
import { mapEquipmentRowToDetail, mapEquipmentRowToSummary } from './equipment.mapper'

export class SupabaseEquipmentRepository implements EquipmentRepository {
  async listSummaries(): Promise<EquipmentSummary[]> {
    const { data, error } = await supabase
      .from('equipments')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) throw error
    return data.map(mapEquipmentRowToSummary)
  }

  async getById(id: EquipmentId): Promise<EquipmentDetail | null> {
    const { data, error } = await supabase
      .from('equipments')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    return mapEquipmentRowToDetail(data)
  }

  async create(input: CreateEquipmentInput): Promise<EquipmentId> {
    const { data, error } = await supabase
      .from('equipments')
      .insert({
        nom: input.nom,
        categorie: input.categorie ?? null,
        marque: input.marque ?? null,
        modele: input.modele ?? null,
        annee: input.annee ?? null,
        plaque: input.plaque ?? null,
        numero_serie: input.numeroSerie ?? null,
        entretien: input.entretien ?? null,
        notes: input.notes ?? null,
      })
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }

  async update(id: EquipmentId, input: UpdateEquipmentInput): Promise<void> {
    const { error } = await supabase
      .from('equipments')
      .update({
        nom: input.nom,
        categorie: input.categorie ?? null,
        marque: input.marque ?? null,
        modele: input.modele ?? null,
        annee: input.annee ?? null,
        plaque: input.plaque ?? null,
        numero_serie: input.numeroSerie ?? null,
        entretien: input.entretien ?? null,
        notes: input.notes ?? null,
      })
      .eq('id', id)
    if (error) throw error
  }

  async updateStatus(id: EquipmentId, status: EquipmentStatus): Promise<void> {
    const { error } = await supabase.from('equipments').update({ statut: status }).eq('id', id)
    if (error) throw error
  }
}
