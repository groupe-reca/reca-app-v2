import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { CreateEquipmentInput } from '../domain/equipment.types'
import { equipmentKeys } from './equipmentKeys'

export function useCreateEquipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateEquipmentInput) => dependencies.equipmentRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: equipmentKeys.list() })
    },
  })
}
