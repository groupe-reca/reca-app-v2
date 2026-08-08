import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { RouteId } from '../domain/route.types'
import { routeKeys } from './routeKeys'

export function useRoute(id: RouteId | undefined) {
  return useQuery({
    queryKey: routeKeys.detail(id ?? ''),
    queryFn: () => dependencies.routeRepository.getById(id ?? ''),
    enabled: Boolean(id),
  })
}
