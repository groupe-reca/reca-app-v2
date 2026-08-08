import { z } from 'zod'

// Matches reca-app's real invoice.schema.ts — client_id/contrat_id are
// passed as separate args to the service, not form fields.
export const createInvoiceSchema = z.object({
  date: z.string().min(1, 'La date est requise'),
  sousTotal: z
    .string()
    .min(1, 'Le sous-total est requis')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: 'Le sous-total doit être un nombre positif',
    }),
  tps: z
    .string()
    .min(1, 'La TPS est requise')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: 'La TPS doit être un nombre positif',
    }),
  tvq: z
    .string()
    .min(1, 'La TVQ est requise')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: 'La TVQ doit être un nombre positif',
    }),
})

export type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>
