import { z } from 'zod'

// Matches reca-app's real leadSchema field-for-field (schemas/lead.schema.ts).
export const createLeadSchema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  telephone: z.string().optional(),
  courriel: z.union([z.literal(''), z.email('Courriel invalide')]).optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  typeService: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
})

export type CreateLeadFormValues = z.infer<typeof createLeadSchema>
