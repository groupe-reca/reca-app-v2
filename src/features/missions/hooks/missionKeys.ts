import type { MissionId } from '../domain/mission.types'

// docs/03-Application-Architecture.md §30 — structured query keys.
export const missionKeys = {
  all: ['missions'] as const,
  lists: () => [...missionKeys.all, 'list'] as const,
  list: () => [...missionKeys.lists()] as const,
  details: () => [...missionKeys.all, 'detail'] as const,
  detail: (id: MissionId) => [...missionKeys.details(), id] as const,
}
