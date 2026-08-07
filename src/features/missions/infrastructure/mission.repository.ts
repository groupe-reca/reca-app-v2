import { supabase } from '@/infrastructure/supabase/client'
import type { Database } from '@/infrastructure/supabase/database.types'
import type { MissionRepository } from '../domain/mission.repository'
import type { MissionDetail, MissionId, MissionSummary } from '../domain/mission.types'
import { mapMissionRowToDetail, mapMissionRowToSummary } from './mission.mapper'

type MissionItemRow = Database['public']['Tables']['mission_items']['Row']

// NOTE: uses separate per-table queries rather than a single PostgREST
// embedded select (`route:routes(nom)`) because the hand-written
// Database type (see database.types.ts header) doesn't carry the
// `Relationships` metadata supabase-js needs to type embeds safely.
// Switch to an embedded select once real `supabase gen types
// typescript` output is available.
function uniqueDefined<T>(values: (T | null | undefined)[]): T[] {
  return [
    ...new Set(
      values.filter((value): value is T => value !== null && value !== undefined),
    ),
  ]
}

async function fetchMissionItemsByMissionIds(
  missionIds: string[],
): Promise<Map<string, MissionItemRow[]>> {
  if (missionIds.length === 0) return new Map()
  const { data, error } = await supabase
    .from('mission_items')
    .select('*')
    .in('mission_id', missionIds)
    .is('deleted_at', null)
  if (error) throw error

  const itemsByMissionId = new Map<string, MissionItemRow[]>()
  for (const item of data) {
    const existing = itemsByMissionId.get(item.mission_id) ?? []
    existing.push(item)
    itemsByMissionId.set(item.mission_id, existing)
  }
  return itemsByMissionId
}

export class SupabaseMissionRepository implements MissionRepository {
  async listSummaries(): Promise<MissionSummary[]> {
    const { data: missions, error } = await supabase
      .from('missions')
      .select('*')
      .is('deleted_at', null)
      .order('date', { ascending: false })
      .limit(50)
    if (error) throw error

    const [routesResult, employeesResult, equipmentsResult, itemsByMissionId] =
      await Promise.all([
        supabase
          .from('routes')
          .select('*')
          .in('id', uniqueDefined(missions.map((m) => m.route_id))),
        supabase
          .from('employees')
          .select('*')
          .in('id', uniqueDefined(missions.map((m) => m.operator_id))),
        supabase
          .from('equipments')
          .select('*')
          .in('id', uniqueDefined(missions.map((m) => m.equipment_id))),
        fetchMissionItemsByMissionIds(missions.map((m) => m.id)),
      ])
    if (routesResult.error) throw routesResult.error
    if (employeesResult.error) throw employeesResult.error
    if (equipmentsResult.error) throw equipmentsResult.error

    const lookups = {
      routesById: new Map(routesResult.data.map((r) => [r.id, r])),
      employeesById: new Map(employeesResult.data.map((e) => [e.id, e])),
      equipmentsById: new Map(equipmentsResult.data.map((e) => [e.id, e])),
      itemsByMissionId,
    }

    return missions.map((row) => mapMissionRowToSummary(row, lookups))
  }

  async getById(id: MissionId): Promise<MissionDetail | null> {
    const { data: mission, error } = await supabase
      .from('missions')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) throw error
    if (!mission) return null

    const itemsByMissionId = await fetchMissionItemsByMissionIds([mission.id])
    const items = itemsByMissionId.get(mission.id) ?? []

    const [routeResult, employeeResult, equipmentResult, contractsResult] =
      await Promise.all([
        supabase.from('routes').select('*').eq('id', mission.route_id),
        mission.operator_id
          ? supabase.from('employees').select('*').eq('id', mission.operator_id)
          : Promise.resolve({ data: [], error: null } as const),
        mission.equipment_id
          ? supabase.from('equipments').select('*').eq('id', mission.equipment_id)
          : Promise.resolve({ data: [], error: null } as const),
        supabase
          .from('contracts')
          .select('*')
          .in('id', uniqueDefined(items.map((i) => i.contract_id))),
      ])
    if (routeResult.error) throw routeResult.error
    if (employeeResult.error) throw employeeResult.error
    if (equipmentResult.error) throw equipmentResult.error
    if (contractsResult.error) throw contractsResult.error

    const clientsResult = await supabase
      .from('clients')
      .select('*')
      .in('id', uniqueDefined(contractsResult.data.map((c) => c.client_id)))
    if (clientsResult.error) throw clientsResult.error

    return mapMissionRowToDetail(mission, {
      routesById: new Map(routeResult.data.map((r) => [r.id, r])),
      employeesById: new Map(employeeResult.data.map((e) => [e.id, e])),
      equipmentsById: new Map(equipmentResult.data.map((e) => [e.id, e])),
      itemsByMissionId,
      contractsById: new Map(contractsResult.data.map((c) => [c.id, c])),
      clientsById: new Map(clientsResult.data.map((c) => [c.id, c])),
    })
  }
}
