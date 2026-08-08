import type { StatusTone } from '@/components/ui/StatusBadge'

// docs/03-Application-Architecture.md §18 — statuses are business
// contracts with a stable value, a French label, and a visual tone.
//
// The real shared Supabase schema (reca-app's
// supabase/migrations/20260723000000_missions.sql) stores French
// lowercase values: planifiee | en_cours | terminee |
// terminee_avec_anomalies | annulee. This app-level type is
// deliberately distinct from that DB representation — see
// mapLegacyMissionStatus below — per the anti-corruption layer
// mandated in docs/03-Application-Architecture.md §52, so the rest of
// the app never depends on the legacy DB spelling.
export type MissionStatus =
  'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'COMPLETED_WITH_ISSUES' | 'CANCELLED'

export const missionStatusMeta: Record<
  MissionStatus,
  { label: string; tone: StatusTone }
> = {
  PLANNED: { label: 'Planifiée', tone: 'neutral' },
  IN_PROGRESS: { label: 'En cours', tone: 'success' },
  COMPLETED: { label: 'Terminée', tone: 'success' },
  COMPLETED_WITH_ISSUES: { label: 'Terminée avec anomalies', tone: 'warning' },
  CANCELLED: { label: 'Annulée', tone: 'neutral' },
}

export type LegacyMissionStatus =
  'planifiee' | 'en_cours' | 'terminee' | 'terminee_avec_anomalies' | 'annulee'

const legacyToMissionStatus: Record<LegacyMissionStatus, MissionStatus> = {
  planifiee: 'PLANNED',
  en_cours: 'IN_PROGRESS',
  terminee: 'COMPLETED',
  terminee_avec_anomalies: 'COMPLETED_WITH_ISSUES',
  annulee: 'CANCELLED',
}

export function mapLegacyMissionStatus(value: LegacyMissionStatus): MissionStatus {
  return legacyToMissionStatus[value]
}

const missionStatusToLegacy: Record<MissionStatus, LegacyMissionStatus> = {
  PLANNED: 'planifiee',
  IN_PROGRESS: 'en_cours',
  COMPLETED: 'terminee',
  COMPLETED_WITH_ISSUES: 'terminee_avec_anomalies',
  CANCELLED: 'annulee',
}

export function mapMissionStatusToLegacy(value: MissionStatus): LegacyMissionStatus {
  return missionStatusToLegacy[value]
}
