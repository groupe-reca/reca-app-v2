import type { MissionStatus } from '@/domain/missionStatus'

export type MissionId = string

export interface MissionSummary {
  id: MissionId
  numero: number | null
  date: string
  status: MissionStatus
  routeName: string
  operatorName: string | null
  equipmentName: string | null
  itemsDone: number
  itemsTotal: number
  hasProblem: boolean
}

export interface MissionItemDetail {
  id: string
  status: 'en_attente' | 'en_cours' | 'terminee' | 'a_reprendre' | 'impossible'
  contractNumero: string | null
  clientLabel: string
}

export interface MissionDetail extends MissionSummary {
  notes: string | null
  items: MissionItemDetail[]
}
