import { z } from 'zod'

// Matches reca-app's real equipment.schema.ts field-for-field. `statut`
// is deliberately not part of create/edit — it's managed separately via
// a dedicated status update, same as this app's updateEquipmentStatus.
export const createEquipmentSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  categorie: z.string().optional(),
  marque: z.string().optional(),
  modele: z.string().optional(),
  annee: z
    .string()
    .optional()
    .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) > 1900), {
      message: 'Année invalide',
    }),
  plaque: z.string().optional(),
  numeroSerie: z.string().optional(),
  entretien: z.string().optional(),
  notes: z.string().optional(),
})

export type CreateEquipmentFormValues = z.infer<typeof createEquipmentSchema>
