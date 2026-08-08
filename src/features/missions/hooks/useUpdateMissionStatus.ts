import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { MissionStatus } from '@/domain/missionStatus'
import type { MissionId } from '../domain/mission.types'
import { missionKeys } from './missionKeys'

export function useUpdateMissionStatus(id: MissionId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: MissionStatus) =>
      dependencies.missionRepository.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: missionKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: missionKeys.list() })
    },
  })
}
