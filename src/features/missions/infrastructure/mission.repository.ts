import { supabase } from '@/infrastructure/supabase/client'
import type { Database } from '@/infrastructure/supabase/database.types'
import { mapMissionStatusToLegacy, type MissionStatus } from '@/domain/missionStatus'
import type { MissionRepository } from '../domain/mission.repository'
import type {
  MissionDetail,
  MissionId,
  MissionItemDetail,
  MissionSummary,
} from '../domain/mission.types'
import { mapMissionRowToDetail, mapMissionRowToSummary } from './mission.mapper'

type MissionEventType = Database['public']['Tables']['mission_events']['Row']['type']

// Same transition -> event mapping as reca-app's
// missions.service.ts#updateMissionStatus (mirrored, not reinvented).
// PLANNED has no corresponding "transition to" event (missions start
// there); pause/resume events exist in the DB's mission_events check
// constraint but have no matching missions.statut value in the real
// schema, so they're not modeled as a status transition here.
const statusTransitionEvent: Partial<Record<MissionStatus, MissionEventType>> = {
  IN_PROGRESS: 'mission_debutee',
  COMPLETED: 'mission_terminee',
  COMPLETED_WITH_ISSUES: 'mission_terminee_avec_anomalies',
  CANCELLED: 'mission_annulee',
}

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

  async updateStatus(id: MissionId, status: MissionStatus): Promise<void> {
    const legacyStatus = mapMissionStatusToLegacy(status)
    const patch: Database['public']['Tables']['missions']['Update'] = {
      statut: legacyStatus,
    }
    if (status === 'IN_PROGRESS') patch.heure_debut = new Date().toISOString()
    if (status === 'COMPLETED' || status === 'COMPLETED_WITH_ISSUES') {
      patch.heure_fin = new Date().toISOString()
    }

    const { error } = await supabase.from('missions').update(patch).eq('id', id)
    if (error) throw error

    // Mirrors reca-app's missions.service.ts#updateMissionStatus: log the
    // transition atomically-enough for a UI action (RLS still guards both
    // writes independently — see mission_events_insert_authenticated).
    const eventType = statusTransitionEvent[status]
    if (eventType) {
      const { error: eventError } = await supabase
        .from('mission_events')
        .insert({ mission_id: id, type: eventType, payload: { statut: legacyStatus } })
      if (eventError) throw eventError
    }
  }

  async updateItemStatus(
    itemId: string,
    status: MissionItemDetail['status'],
  ): Promise<void> {
    const { error } = await supabase
      .from('mission_items')
      .update({ statut: status })
      .eq('id', itemId)
    if (error) throw error
  }
}
