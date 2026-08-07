import { z } from 'zod'

const EnvSchema = z.object({
  VITE_SUPABASE_URL: z.url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_APP_ENV: z
    .enum(['development', 'test', 'staging', 'production'])
    .default('development'),
})

export const env = EnvSchema.parse(import.meta.env)
