import type { StatusTone } from '@/components/ui/StatusBadge'

// Real DB values (reca-app/supabase/migrations/20260719000000_clients_statut_langue.sql):
// clients.statut in ('actif', 'inactif'). No anti-corruption mapping
// needed here (unlike Mission) — the two values already read fine as
// app-level labels.
export type ClientStatus = 'actif' | 'inactif'

export const clientStatusMeta: Record<ClientStatus, { label: string; tone: StatusTone }> =
  {
    actif: { label: 'Actif', tone: 'success' },
    inactif: { label: 'Inactif', tone: 'neutral' },
  }

export type ContractStatus = 'actif' | 'en_attente' | 'expire' | 'annule'

export const contractStatusMeta: Record<
  ContractStatus,
  { label: string; tone: StatusTone }
> = {
  actif: { label: 'Actif', tone: 'success' },
  en_attente: { label: 'En attente', tone: 'warning' },
  expire: { label: 'Expiré', tone: 'neutral' },
  annule: { label: 'Annulé', tone: 'danger' },
}
