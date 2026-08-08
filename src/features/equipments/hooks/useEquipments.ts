import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { equipmentKeys } from './equipmentKeys'

export function useEquipments() {
  return useQuery({
    queryKey: equipmentKeys.list(),
    queryFn: () => dependencies.equipmentRepository.listSummaries(),
  })
}
