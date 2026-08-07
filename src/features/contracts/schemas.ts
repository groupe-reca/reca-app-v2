import { z } from 'zod'

export const contractClientStepSchema = z.object({
  clientName: z.string().min(2, 'Le nom du client doit contenir au moins 2 caractères'),
  clientType: z.enum(['RESIDENTIEL', 'COMMERCIAL']),
})

export const contractServiceStepSchema = z.object({
  serviceLabel: z.string().min(2, 'Décrivez le service offert'),
  priceCents: z
    .number()
    .int('Le prix doit être un montant entier en cents')
    .positive('Le prix doit être supérieur à zéro'),
})

export type ContractClientStep = z.infer<typeof contractClientStepSchema>
export type ContractServiceStep = z.infer<typeof contractServiceStepSchema>
