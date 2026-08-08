import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { routeKeys } from './routeKeys'

export function useRoutes() {
  return useQuery({
    queryKey: routeKeys.list(),
    queryFn: () => dependencies.routeRepository.listSummaries(),
  })
}
