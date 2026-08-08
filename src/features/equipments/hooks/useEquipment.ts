import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { EquipmentId } from '../domain/equipment.types'
import { equipmentKeys } from './equipmentKeys'

export function useEquipment(id: EquipmentId | undefined) {
  return useQuery({
    queryKey: equipmentKeys.detail(id ?? ''),
    queryFn: () => dependencies.equipmentRepository.getById(id ?? ''),
    enabled: Boolean(id),
  })
}
