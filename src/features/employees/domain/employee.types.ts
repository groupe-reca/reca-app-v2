export type EmployeeId = string

export interface EmployeeSummary {
  id: EmployeeId
  displayName: string
  phone: string | null
  email: string | null
  poste: string | null
  role: string | null
  active: boolean
}

export interface EmployeeDetail extends EmployeeSummary {
  dateEmbauche: string | null
  notes: string | null
  createdAt: string
}

export interface CreateEmployeeInput {
  prenom: string
  nom: string
  telephone?: string
  courriel?: string
  poste?: string
  role?: string
  dateEmbauche?: string
  notes?: string
}

export interface UpdateEmployeeInput {
  prenom: string
  nom: string
  telephone?: string
  courriel?: string
  poste?: string
  role?: string
  dateEmbauche?: string
  notes?: string
}
