import { supabase } from '@/infrastructure/supabase/client'
import type { LeadStatus } from '@/domain/leadStatus'
import type { LeadRepository } from '../domain/lead.repository'
import type { CreateLeadInput, LeadDetail, LeadId, LeadSummary } from '../domain/lead.types'
import { mapLeadRowToDetail, mapLeadRowToSummary } from './lead.mapper'

export class SupabaseLeadRepository implements LeadRepository {
  async listSummaries(): Promise<LeadSummary[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return data.map(mapLeadRowToSummary)
  }

  async getById(id: LeadId): Promise<LeadDetail | null> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    return mapLeadRowToDetail(data)
  }

  async updateStatus(id: LeadId, status: LeadStatus): Promise<void> {
    const { error } = await supabase.from('leads').update({ statut: status }).eq('id', id)
    if (error) throw error
  }

  async create(input: CreateLeadInput): Promise<LeadId> {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        prenom: input.prenom,
        nom: input.nom,
        telephone: input.telephone ?? null,
        courriel: input.courriel ?? null,
        adresse: input.adresse ?? null,
        ville: input.ville ?? null,
        type_service: input.typeService ?? null,
        message: input.message ?? null,
        source: input.source ?? null,
      })
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }
}
