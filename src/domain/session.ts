// docs/05-Authentication-Roles-Permissions.md §23 (AppSession) simplified
// to match what actually exists in the shared DB: `reca-app`'s
// public.users.role is a single 3-value field
// (supabase/migrations/20260709143631_users.sql,
// 20260723010000_users_role_operateur.sql), not the full
// roles/permissions/user_roles tables the doc's aspirational model
// describes. Doc §22 explicitly sanctions this as a valid "modèle
// simplifié temporaire" as long as permissions stay centralized in code
// — that's what canWrite() below does. The full permission-key matrix in
// docs §51 is marked "à valider avant production" and isn't backed by
// any real RLS policy yet; building it out now would be a UI-only
// decoration with no matching enforcement, which docs §2 explicitly
// warns against ("masquer un bouton n'est pas une sécurité").
export type Role = 'administrateur' | 'employe' | 'operateur'

export interface AppSession {
  userId: string
  email: string
  role: Role
  actif: boolean
  displayName: string | null
  theme: 'clair' | 'sombre'
}

// Mirrors the real RLS shape today (supabase/migrations/20260709143718_rls_policies.sql:
// "any authenticated user may read; only administrateur may write"), plus the
// operator's narrower mission_items write access
// (20260723020000_mission_items_operator_update.sql). Extend this — and the
// matching RLS policy — together, never one without the other.
export function canWrite(session: AppSession): boolean {
  return session.role === 'administrateur'
}

export function isOperator(session: AppSession): boolean {
  return session.role === 'operateur'
}
