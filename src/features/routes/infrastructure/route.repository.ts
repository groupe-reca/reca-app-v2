import { supabase } from '@/infrastructure/supabase/client'
import type { RouteRepository } from '../domain/route.repository'
import type { RouteDetail, RouteId, RouteSummary } from '../domain/route.types'
import { mapRouteRowToDetail, mapRouteRowToSummary } from './route.mapper'

function uniqueDefined<T>(values: (T | null | undefined)[]): T[] {
  return [
    ...new Set(
      values.filter((value): value is T => value !== null && value !== undefined),
    ),
  ]
}

export class SupabaseRouteRepository implements RouteRepository {
  async listSummaries(): Promise<RouteSummary[]> {
    const { data: routes, error } = await supabase
      .from('routes')
      .select('*')
      .is('deleted_at', null)
      .order('nom', { ascending: true })
    if (error) throw error

    const [employeesResult, equipmentsResult, routeContractsResult] = await Promise.all([
      supabase
        .from('employees')
        .select('*')
        .in('id', uniqueDefined(routes.map((r) => r.operator_id))),
      supabase
        .from('equipments')
        .select('*')
        .in('id', uniqueDefined(routes.map((r) => r.equipment_id))),
      supabase
        .from('route_contracts')
        .select('*')
        .in(
          'route_id',
          routes.map((r) => r.id),
        )
        .is('deleted_at', null),
    ])
    if (employeesResult.error) throw employeesResult.error
    if (equipmentsResult.error) throw equipmentsResult.error
    if (routeContractsResult.error) throw routeContractsResult.error

    const contractCountByRouteId = new Map<string, number>()
    for (const rc of routeContractsResult.data) {
      contractCountByRouteId.set(
        rc.route_id,
        (contractCountByRouteId.get(rc.route_id) ?? 0) + 1,
      )
    }

    const lookups = {
      employeesById: new Map(employeesResult.data.map((e) => [e.id, e])),
      equipmentsById: new Map(equipmentsResult.data.map((e) => [e.id, e])),
      contractCountByRouteId,
    }

    return routes.map((row) => mapRouteRowToSummary(row, lookups))
  }

  async getById(id: RouteId): Promise<RouteDetail | null> {
    const { data: route, error } = await supabase
      .from('routes')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) throw error
    if (!route) return null

    const [employeeResult, equipmentResult, routeContractsResult] = await Promise.all([
      route.operator_id
        ? supabase.from('employees').select('*').eq('id', route.operator_id)
        : Promise.resolve({ data: [], error: null } as const),
      route.equipment_id
        ? supabase.from('equipments').select('*').eq('id', route.equipment_id)
        : Promise.resolve({ data: [], error: null } as const),
      supabase
        .from('route_contracts')
        .select('*')
        .eq('route_id', id)
        .is('deleted_at', null)
        .order('ordre', { ascending: true }),
    ])
    if (employeeResult.error) throw employeeResult.error
    if (equipmentResult.error) throw equipmentResult.error
    if (routeContractsResult.error) throw routeContractsResult.error

    const contractsResult = await supabase
      .from('contracts')
      .select('*')
      .in('id', uniqueDefined(routeContractsResult.data.map((rc) => rc.contract_id)))
    if (contractsResult.error) throw contractsResult.error

    return mapRouteRowToDetail(
      route,
      {
        employeesById: new Map(employeeResult.data.map((e) => [e.id, e])),
        equipmentsById: new Map(equipmentResult.data.map((e) => [e.id, e])),
        contractCountByRouteId: new Map(),
      },
      routeContractsResult.data,
      new Map(contractsResult.data.map((c) => [c.id, c])),
    )
  }
}
