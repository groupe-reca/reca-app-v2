import type { StatusTone } from '@/components/ui/StatusBadge'

// Real DB values + labels/tones, cross-checked against reca-app's
// LeadStatusBadge.tsx and lead.types.ts LEAD_STATUS_LABELS — no
// anti-corruption mapping needed, the DB values read fine as-is, only
// the badge colour names differ (reca-app: blue/orange/orange/green/gray
// → this app's tone system: info/warning/warning/success/neutral).
export type LeadStatus = 'nouveau' | 'contacte' | 'soumission_envoyee' | 'converti' | 'perdu'

export const leadStatusMeta: Record<LeadStatus, { label: string; tone: StatusTone }> = {
  nouveau: { label: 'Nouveau', tone: 'info' },
  contacte: { label: 'Contacté', tone: 'warning' },
  soumission_envoyee: { label: 'Soumission envoyée', tone: 'warning' },
  converti: { label: 'Converti', tone: 'success' },
  perdu: { label: 'Perdu', tone: 'neutral' },
}

export const leadStatusOrder: LeadStatus[] = [
  'nouveau',
  'contacte',
  'soumission_envoyee',
  'converti',
  'perdu',
]
