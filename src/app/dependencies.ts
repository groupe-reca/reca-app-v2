import { SupabaseMissionRepository } from '@/features/missions/infrastructure/mission.repository'

// docs/03-Application-Architecture.md §89 — concrete adapters assembled
// in one place; use cases/hooks depend on the interfaces, not on this
// file directly, but this is where the wiring happens.
export const dependencies = {
  missionRepository: new SupabaseMissionRepository(),
}
