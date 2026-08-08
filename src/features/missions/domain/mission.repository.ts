import type { MissionStatus } from '@/domain/missionStatus'
import type {
  MissionDetail,
  MissionId,
  MissionItemDetail,
  MissionSummary,
} from './mission.types'

// Port per docs/03-Application-Architecture.md §23 — the domain/application
// layers depend on this interface, never on Supabase directly.
export interface MissionRepository {
  listSummaries(): Promise<MissionSummary[]>
  getById(id: MissionId): Promise<MissionDetail | null>
  updateStatus(id: MissionId, status: MissionStatus): Promise<void>
  updateItemStatus(itemId: string, status: MissionItemDetail['status']): Promise<void>
}
