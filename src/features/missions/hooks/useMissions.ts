import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { missionKeys } from './missionKeys'

export function useMissions() {
  return useQuery({
    queryKey: missionKeys.list(),
    queryFn: () => dependencies.missionRepository.listSummaries(),
  })
}
