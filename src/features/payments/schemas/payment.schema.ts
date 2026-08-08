import { z } from 'zod'

// Matches reca-app's real payment.schema.ts — facture_id is passed
// separately, not a form field.
export const createPaymentSchema = z.object({
  montant: z
    .string()
    .min(1, 'Le montant est requis')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: 'Le montant doit être supérieur à zéro',
    }),
  methode: z.string().optional(),
  reference: z.string().optional(),
  date: z.string().min(1, 'La date est requise'),
  notes: z.string().optional(),
})

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>
