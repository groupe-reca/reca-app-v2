import type { StatusTone } from '@/components/ui/StatusBadge'

// Real DB values + labels/tones, cross-checked against reca-app's
// QuoteStatusBadge.tsx and quote.types.ts — no anti-corruption mapping
// needed, the DB values read fine as-is.
export type QuoteStatus = 'brouillon' | 'envoyee' | 'acceptee' | 'refusee' | 'expiree'

export const quoteStatusMeta: Record<QuoteStatus, { label: string; tone: StatusTone }> = {
  brouillon: { label: 'Brouillon', tone: 'neutral' },
  envoyee: { label: 'Envoyée', tone: 'info' },
  acceptee: { label: 'Acceptée', tone: 'success' },
  refusee: { label: 'Refusée', tone: 'danger' },
  expiree: { label: 'Expirée', tone: 'warning' },
}

export const quoteStatusOrder: QuoteStatus[] = [
  'brouillon',
  'envoyee',
  'acceptee',
  'refusee',
  'expiree',
]
