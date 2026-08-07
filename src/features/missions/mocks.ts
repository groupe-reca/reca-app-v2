// Placeholder mock data — NOT wired to Supabase yet (see memory.md,
// tasks.md T-001). Replace with real queries once the shared Supabase
// schema and repositories exist. Shape mirrors the domain model in
// docs/00-Vision.md §9.5–9.6, not the DB row shape.
import type { MissionStatus } from '@/domain/missionStatus'

export interface MissionSummary {
  id: string
  number: string
  routeName: string
  status: MissionStatus
  operatorName: string | null
  equipmentName: string | null
  itemsDone: number
  itemsTotal: number
  lastSyncMinutesAgo: number | null
  hasProblem: boolean
}

export const mockMissions: MissionSummary[] = [
  {
    id: 'm1',
    number: 'MIS-2026-0041',
    routeName: 'Secteur Sainte-Foy — Route 3',
    status: 'IN_PROGRESS',
    operatorName: 'Marc-Antoine Roy',
    equipmentName: 'Camion 12',
    itemsDone: 18,
    itemsTotal: 28,
    lastSyncMinutesAgo: 2,
    hasProblem: false,
  },
  {
    id: 'm2',
    number: 'MIS-2026-0042',
    routeName: 'Secteur Beauport — Route 1',
    status: 'IN_PROGRESS',
    operatorName: 'Julie Bergeron',
    equipmentName: 'Camion 7',
    itemsDone: 9,
    itemsTotal: 22,
    lastSyncMinutesAgo: 7,
    hasProblem: true,
  },
  {
    id: 'm3',
    number: 'MIS-2026-0043',
    routeName: 'Secteur Charlesbourg — Route 2',
    status: 'READY',
    operatorName: 'Simon Tremblay',
    equipmentName: 'Camion 4',
    itemsDone: 0,
    itemsTotal: 19,
    lastSyncMinutesAgo: null,
    hasProblem: false,
  },
  {
    id: 'm4',
    number: 'MIS-2026-0044',
    routeName: 'Secteur Lévis — Route 5',
    status: 'PLANNED',
    operatorName: null,
    equipmentName: null,
    itemsDone: 0,
    itemsTotal: 31,
    lastSyncMinutesAgo: null,
    hasProblem: false,
  },
  {
    id: 'm5',
    number: 'MIS-2026-0038',
    routeName: 'Secteur Sainte-Foy — Route 1',
    status: 'COMPLETED',
    operatorName: 'Marc-Antoine Roy',
    equipmentName: 'Camion 12',
    itemsDone: 24,
    itemsTotal: 24,
    lastSyncMinutesAgo: 340,
    hasProblem: false,
  },
]
