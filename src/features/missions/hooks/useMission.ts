import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { MissionId } from '../domain/mission.types'
import { missionKeys } from './missionKeys'

export function useMission(id: MissionId | undefined) {
  return useQuery({
    queryKey: missionKeys.detail(id ?? ''),
    queryFn: () => dependencies.missionRepository.getById(id ?? ''),
    enabled: Boolean(id),
  })
}
