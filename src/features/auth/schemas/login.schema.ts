import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Courriel invalide').min(1, 'Le courriel est requis'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

export type LoginInput = z.infer<typeof loginSchema>
