import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useEmployee } from '../hooks/useEmployee'
import { useSetEmployeeActive } from '../hooks/useSetEmployeeActive'

export function EmployeeDetailPage() {
  const { employeeId } = useParams()
  const { data: employee, isLoading, isError } = useEmployee(employeeId)
  const setActive = useSetEmployeeActive(employeeId ?? '')

  if (isLoading) {
    return <div className="p-8 text-body-sm text-text-muted">Chargement…</div>
  }

  if (isError || !employee) {
    return (
      <div className="p-8">
        <EmptyState
          title="Employé introuvable"
          description="Vérifiez le lien, ou l’authentification requise pour lire cette donnée n’est pas encore en place."
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">Employé · {employee.role ?? '—'}</p>
          <h1 className="text-heading-xl font-bold">{employee.displayName}</h1>
          <p className="mt-1 text-body-md text-text-secondary">{employee.poste ?? '—'}</p>
        </div>
        <StatusBadge
          label={employee.active ? 'Actif' : 'Inactif'}
          tone={employee.active ? 'success' : 'neutral'}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Téléphone</p>
          <p className="mt-1 text-body-md font-medium">{employee.phone ?? '—'}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Courriel</p>
          <p className="mt-1 truncate text-body-md font-medium">{employee.email ?? '—'}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Date d’embauche</p>
          <p className="mt-1 text-body-md font-medium">
            {employee.dateEmbauche
              ? new Date(employee.dateEmbauche).toLocaleDateString('fr-CA')
              : '—'}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Rôle</p>
          <p className="mt-1 text-body-md font-medium">{employee.role ?? '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Notes" />
            <p className="whitespace-pre-wrap text-body-sm text-text-secondary">
              {employee.notes ?? 'Aucune note.'}
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Statut" />
            <Button
              variant={employee.active ? 'secondary' : 'primary'}
              disabled={setActive.isPending}
              onClick={() => {
                setActive.mutate(!employee.active)
              }}
            >
              {employee.active ? 'Marquer inactif' : 'Marquer actif'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
