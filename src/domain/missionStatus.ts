import type { StatusTone } from '@/components/ui/StatusBadge'

// docs/03-Application-Architecture.md §18 — statuses are business
// contracts with a stable value, a French label, and a visual tone;
// they must not be invented ad hoc in a component.
export type MissionStatus =
  'PLANNED' | 'READY' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'

export const missionStatusMeta: Record<
  MissionStatus,
  { label: string; tone: StatusTone }
> = {
  PLANNED: { label: 'Planifiée', tone: 'neutral' },
  READY: { label: 'Prête', tone: 'info' },
  IN_PROGRESS: { label: 'En cours', tone: 'success' },
  PAUSED: { label: 'En pause', tone: 'warning' },
  COMPLETED: { label: 'Terminée', tone: 'success' },
  CANCELLED: { label: 'Annulée', tone: 'neutral' },
}
