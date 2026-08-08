import { supabase } from '@/infrastructure/supabase/client'
import type { EmployeeRepository } from '../domain/employee.repository'
import type {
  CreateEmployeeInput,
  EmployeeDetail,
  EmployeeId,
  EmployeeSummary,
  UpdateEmployeeInput,
} from '../domain/employee.types'
import { mapEmployeeRowToDetail, mapEmployeeRowToSummary } from './employee.mapper'

export class SupabaseEmployeeRepository implements EmployeeRepository {
  async listSummaries(): Promise<EmployeeSummary[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) throw error
    return data.map(mapEmployeeRowToSummary)
  }

  async getById(id: EmployeeId): Promise<EmployeeDetail | null> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    return mapEmployeeRowToDetail(data)
  }

  async create(input: CreateEmployeeInput): Promise<EmployeeId> {
    const { data, error } = await supabase
      .from('employees')
      .insert({
        prenom: input.prenom,
        nom: input.nom,
        telephone: input.telephone ?? null,
        courriel: input.courriel ?? null,
        poste: input.poste ?? null,
        role: input.role ?? null,
        date_embauche: input.dateEmbauche ?? null,
        notes: input.notes ?? null,
      })
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }

  async update(id: EmployeeId, input: UpdateEmployeeInput): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .update({
        prenom: input.prenom,
        nom: input.nom,
        telephone: input.telephone ?? null,
        courriel: input.courriel ?? null,
        poste: input.poste ?? null,
        role: input.role ?? null,
        date_embauche: input.dateEmbauche ?? null,
        notes: input.notes ?? null,
      })
      .eq('id', id)
    if (error) throw error
  }

  async setActive(id: EmployeeId, active: boolean): Promise<void> {
    const { error } = await supabase.from('employees').update({ actif: active }).eq('id', id)
    if (error) throw error
  }
}
