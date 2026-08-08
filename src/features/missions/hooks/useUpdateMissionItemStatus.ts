import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { MissionId, MissionItemDetail } from '../domain/mission.types'
import { missionKeys } from './missionKeys'

export function useUpdateMissionItemStatus(missionId: MissionId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      status,
    }: {
      itemId: string
      status: MissionItemDetail['status']
    }) => dependencies.missionRepository.updateItemStatus(itemId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: missionKeys.detail(missionId) })
      void queryClient.invalidateQueries({ queryKey: missionKeys.list() })
    },
  })
}
