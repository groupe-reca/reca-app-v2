import type { StatusTone } from '@/components/ui/StatusBadge'

// Real DB values + labels/tones, cross-checked against reca-app's
// EquipmentStatusBadge.tsx — no anti-corruption mapping needed.
export type EquipmentStatus = 'disponible' | 'en_operation' | 'entretien' | 'brise'

export const equipmentStatusMeta: Record<EquipmentStatus, { label: string; tone: StatusTone }> = {
  disponible: { label: 'Disponible', tone: 'success' },
  en_operation: { label: 'En opération', tone: 'info' },
  entretien: { label: 'Entretien', tone: 'warning' },
  brise: { label: 'Brisé', tone: 'danger' },
}

export const equipmentStatusOrder: EquipmentStatus[] = [
  'disponible',
  'en_operation',
  'entretien',
  'brise',
]

// reca-app's real EQUIPMENT_CATEGORIES constant.
export const equipmentCategories = [
  'Camions',
  'Tracteurs',
  'Chargeuses',
  'Souffleuses',
  'Saleuses',
  'Remorques',
] as const
