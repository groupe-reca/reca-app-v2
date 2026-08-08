import { z } from 'zod'

// Matches reca-app's real employee.schema.ts field-for-field.
export const createEmployeeSchema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  telephone: z.string().optional(),
  courriel: z.union([z.literal(''), z.email('Courriel invalide')]).optional(),
  poste: z.string().optional(),
  role: z.string().optional(),
  dateEmbauche: z.string().optional(),
  notes: z.string().optional(),
})

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>

// reca-app's real EMPLOYEE_ROLES constant (frontend-only — the DB
// column is plain text, no check constraint).
export const employeeRoles = ['Administrateur', 'Employé'] as const
