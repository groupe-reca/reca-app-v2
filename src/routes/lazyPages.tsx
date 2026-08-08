import { lazy } from 'react'

// docs/16-Development-Standards.md §70 — route-level code splitting for
// large modules. Isolated in its own file so react-refresh's
// only-export-components rule stays clean in router.tsx (a lazy()
// call assigned to a PascalCase const reads as a component export to
// that rule even though it isn't itself a component definition).
export const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.DashboardPage })),
)
export const MissionListPage = lazy(() =>
  import('@/features/missions').then((m) => ({ default: m.MissionListPage })),
)
export const MissionDetailPage = lazy(() =>
  import('@/features/missions').then((m) => ({ default: m.MissionDetailPage })),
)
export const RouteListPage = lazy(() =>
  import('@/features/routes').then((m) => ({ default: m.RouteListPage })),
)
export const RouteDetailPage = lazy(() =>
  import('@/features/routes').then((m) => ({ default: m.RouteDetailPage })),
)
export const ClientListPage = lazy(() =>
  import('@/features/clients').then((m) => ({ default: m.ClientListPage })),
)
export const ClientDetailPage = lazy(() =>
  import('@/features/clients').then((m) => ({ default: m.ClientDetailPage })),
)
export const ContractListPage = lazy(() =>
  import('@/features/contracts').then((m) => ({ default: m.ContractListPage })),
)
export const ContractDetailPage = lazy(() =>
  import('@/features/contracts').then((m) => ({ default: m.ContractDetailPage })),
)
export const ContractWizardPage = lazy(() =>
  import('@/features/contracts').then((m) => ({ default: m.ContractWizardPage })),
)
export const LeadListPage = lazy(() =>
  import('@/features/leads').then((m) => ({ default: m.LeadListPage })),
)
export const LeadDetailPage = lazy(() =>
  import('@/features/leads').then((m) => ({ default: m.LeadDetailPage })),
)
export const LeadCreatePage = lazy(() =>
  import('@/features/leads').then((m) => ({ default: m.LeadCreatePage })),
)
export const QuoteListPage = lazy(() =>
  import('@/features/quotes').then((m) => ({ default: m.QuoteListPage })),
)
export const QuoteDetailPage = lazy(() =>
  import('@/features/quotes').then((m) => ({ default: m.QuoteDetailPage })),
)
export const QuoteCreatePage = lazy(() =>
  import('@/features/quotes').then((m) => ({ default: m.QuoteCreatePage })),
)
export const EmployeeListPage = lazy(() =>
  import('@/features/employees').then((m) => ({ default: m.EmployeeListPage })),
)
export const EmployeeDetailPage = lazy(() =>
  import('@/features/employees').then((m) => ({ default: m.EmployeeDetailPage })),
)
export const EmployeeCreatePage = lazy(() =>
  import('@/features/employees').then((m) => ({ default: m.EmployeeCreatePage })),
)
export const EquipmentListPage = lazy(() =>
  import('@/features/equipments').then((m) => ({ default: m.EquipmentListPage })),
)
export const EquipmentDetailPage = lazy(() =>
  import('@/features/equipments').then((m) => ({ default: m.EquipmentDetailPage })),
)
export const EquipmentCreatePage = lazy(() =>
  import('@/features/equipments').then((m) => ({ default: m.EquipmentCreatePage })),
)
// Pulls react-hook-form/zod out of the eager entry chunk — LoginPage is
// the only route rendered before RequireAuth's Suspense boundary
// exists, so it needs its own. Imported from its own file rather than
// the feature's index.ts barrel: RequireAuth is imported eagerly from
// that same barrel elsewhere, and importing LoginPage through it too
// would let the bundler fold LoginPage back into the eager chunk.
export const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
