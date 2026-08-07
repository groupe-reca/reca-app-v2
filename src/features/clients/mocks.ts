// Placeholder mock data — NOT wired to Supabase yet (see memory.md,
// tasks.md T-001).
export interface ClientRecord {
  id: string
  name: string
  type: 'RESIDENTIEL' | 'COMMERCIAL'
  address: string
  phone: string
  email: string
  activeContracts: number
  balanceCents: number
}

export const mockClient: ClientRecord = {
  id: 'c1',
  name: 'Résidences Belle-Neige inc.',
  type: 'COMMERCIAL',
  address: '224 rue Scott, Québec, QC G1K 4H1',
  phone: '418 555-0142',
  email: 'contact@bellenige.example',
  activeContracts: 2,
  balanceCents: 128900,
}
