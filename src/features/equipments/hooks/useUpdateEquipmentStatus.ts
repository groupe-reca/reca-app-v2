import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { EquipmentStatus } from '@/domain/equipmentStatus'
import type { EquipmentId } from '../domain/equipment.types'
import { equipmentKeys } from './equipmentKeys'

export function useUpdateEquipmentStatus(id: EquipmentId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: EquipmentStatus) =>
      dependencies.equipmentRepository.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: equipmentKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: equipmentKeys.list() })
    },
  })
}
