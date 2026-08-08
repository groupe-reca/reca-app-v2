import { z } from 'zod'

// Matches reca-app's real quote.schema.ts field-for-field: montant/taxes
// as numeric strings from the form, expiration/notes optional.
export const createQuoteSchema = z.object({
  montant: z
    .string()
    .min(1, 'Le montant est requis')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: 'Le montant doit être un nombre positif',
    }),
  taxes: z
    .string()
    .min(1, 'Les taxes sont requises')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: 'Les taxes doivent être un nombre positif',
    }),
  expiration: z.string().optional(),
  notes: z.string().optional(),
})

export type CreateQuoteFormValues = z.infer<typeof createQuoteSchema>
