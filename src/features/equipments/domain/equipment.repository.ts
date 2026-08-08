import type { EquipmentStatus } from '@/domain/equipmentStatus'
import type {
  CreateEquipmentInput,
  EquipmentDetail,
  EquipmentId,
  EquipmentSummary,
  UpdateEquipmentInput,
} from './equipment.types'

export interface EquipmentRepository {
  listSummaries(): Promise<EquipmentSummary[]>
  getById(id: EquipmentId): Promise<EquipmentDetail | null>
  create(input: CreateEquipmentInput): Promise<EquipmentId>
  update(id: EquipmentId, input: UpdateEquipmentInput): Promise<void>
  updateStatus(id: EquipmentId, status: EquipmentStatus): Promise<void>
}
