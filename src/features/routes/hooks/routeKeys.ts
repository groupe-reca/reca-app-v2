import type { RouteId } from '../domain/route.types'

export const routeKeys = {
  all: ['routes'] as const,
  lists: () => [...routeKeys.all, 'list'] as const,
  list: () => [...routeKeys.lists()] as const,
  details: () => [...routeKeys.all, 'detail'] as const,
  detail: (id: RouteId) => [...routeKeys.details(), id] as const,
}
