// AUTO-GENERATED PLACEHOLDER — not yet generated from the real schema.
//
// Per memory.md ("DB type generation") this file must be produced by:
//   supabase gen types typescript --project-id <project-id> > src/infrastructure/supabase/database.types.ts
// against the shared Supabase project also used by reca-app (docs/adr/ADR-002-operator-contracts.md).
// It must never be hand-edited once generated — regenerate it instead.
//
// This stub only exists so the rest of the app compiles before Supabase
// project credentials are available. Replace it via the command above
// as part of finishing T-001 in tasks.md.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
