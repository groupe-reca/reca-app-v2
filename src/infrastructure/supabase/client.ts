import { createClient } from '@supabase/supabase-js'
import { env } from '@/config/env'
import type { Database } from './database.types'

// The only place in the app allowed to call createClient(). Pages and
// components must go through repositories, never this client directly
// (docs/16-Development-Standards.md §80–81).
export const supabase = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
)
