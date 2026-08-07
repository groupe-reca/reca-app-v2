import type { MissionDetail, MissionId, MissionSummary } from './mission.types'

// Port per docs/03-Application-Architecture.md §23 — the domain/application
// layers depend on this interface, never on Supabase directly.
export interface MissionRepository {
  listSummaries(): Promise<MissionSummary[]>
  getById(id: MissionId): Promise<MissionDetail | null>
}
