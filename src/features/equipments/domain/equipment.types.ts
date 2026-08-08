import type { EquipmentStatus } from '@/domain/equipmentStatus'

export type EquipmentId = string

export interface EquipmentSummary {
  id: EquipmentId
  numero: string | null
  nom: string
  categorie: string | null
  status: EquipmentStatus
}

export interface EquipmentDetail extends EquipmentSummary {
  marque: string | null
  modele: string | null
  annee: number | null
  plaque: string | null
  numeroSerie: string | null
  entretien: string | null
  notes: string | null
  createdAt: string
}

export interface CreateEquipmentInput {
  nom: string
  categorie?: string
  marque?: string
  modele?: string
  annee?: number
  plaque?: string
  numeroSerie?: string
  entretien?: string
  notes?: string
}

export type UpdateEquipmentInput = CreateEquipmentInput
