import type { EquipmentId } from '../domain/equipment.types'

export const equipmentKeys = {
  all: ['equipments'] as const,
  lists: () => [...equipmentKeys.all, 'list'] as const,
  list: () => [...equipmentKeys.lists()] as const,
  details: () => [...equipmentKeys.all, 'detail'] as const,
  detail: (id: EquipmentId) => [...equipmentKeys.details(), id] as const,
}
