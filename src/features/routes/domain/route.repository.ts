import type { RouteDetail, RouteId, RouteSummary } from './route.types'

export interface RouteRepository {
  listSummaries(): Promise<RouteSummary[]>
  getById(id: RouteId): Promise<RouteDetail | null>
}
