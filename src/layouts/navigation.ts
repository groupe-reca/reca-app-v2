// docs/02-Information-Architecture.md — desktop sidebar tree, exact
// order and grouping. Do not reorder without checking that doc.
export interface NavItem {
  label: string
  to: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    title: 'Centre des opérations',
    items: [{ label: 'Aujourd’hui', to: '/operations' }],
  },
  {
    title: 'Opérations',
    items: [
      { label: 'Missions', to: '/missions' },
      { label: 'Routes', to: '/routes' },
      { label: 'Employés', to: '/employees' },
      { label: 'Équipements', to: '/equipments' },
    ],
  },
  {
    title: 'Clients et contrats',
    items: [
      { label: 'Leads', to: '/leads' },
      { label: 'Soumissions', to: '/quotes' },
      { label: 'Clients', to: '/clients' },
      { label: 'Contrats', to: '/contracts' },
    ],
  },
  {
    title: 'Finances',
    items: [
      { label: 'Factures', to: '/invoices' },
      { label: 'Paiements', to: '/payments' },
    ],
  },
  { title: 'Système', items: [{ label: 'Paramètres', to: '/settings' }] },
]

// Mobile bottom nav — admin/dispatcher variant, max 5 items (docs/01 mobile nav spec).
export const mobileNavItems: NavItem[] = [
  { label: 'Accueil', to: '/operations' },
  { label: 'Missions', to: '/missions' },
  { label: 'Routes', to: '/routes' },
  { label: 'Clients', to: '/clients' },
  { label: 'Menu', to: '/settings' },
]
