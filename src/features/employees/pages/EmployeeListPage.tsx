import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useEmployees } from '../hooks/useEmployees'

type ActiveFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

export function EmployeeListPage() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('ALL')
  const { data: allEmployees, isLoading, isError } = useEmployees()

  const employees = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (allEmployees ?? []).filter((employee) => {
      const matchesActive =
        activeFilter === 'ALL' ||
        (activeFilter === 'ACTIVE' && employee.active) ||
        (activeFilter === 'INACTIVE' && !employee.active)
      const matchesQuery =
        q.length === 0 ||
        employee.displayName.toLowerCase().includes(q) ||
        (employee.poste ?? '').toLowerCase().includes(q)
      return matchesActive && matchesQuery
    })
  }, [allEmployees, query, activeFilter])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-xl font-bold">Employés</h1>
          <p className="mt-1 text-body-sm text-text-muted">
            {isLoading
              ? 'Chargement…'
              : `${String(employees.length)} employé${employees.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/employees/new">
          <Button>Créer un employé</Button>
        </Link>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
        placeholder="Rechercher par nom ou poste…"
        className="h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-body-md placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-focus sm:max-w-sm"
      />

      <div className="flex flex-wrap gap-2">
        {(
          [
            { label: 'Tous', value: 'ALL' },
            { label: 'Actifs', value: 'ACTIVE' },
            { label: 'Inactifs', value: 'INACTIVE' },
          ] as const
        ).map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => {
              setActiveFilter(chip.value)
            }}
            className={`rounded-pill border px-3 py-1.5 text-body-sm font-medium transition-colors ${
              activeFilter === chip.value
                ? 'border-brand-red bg-brand-red/10 text-brand-red'
                : 'border-border-strong text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {isError ? (
        <EmptyState
          title="Impossible de charger les employés"
          description="Une erreur est survenue lors de la lecture des données. Réessayez plus tard."
        />
      ) : !isLoading && employees.length === 0 ? (
        <EmptyState
          title="Aucun employé trouvé"
          description="Essayez d’ajuster la recherche ou les filtres, ou créez un nouvel employé."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-border">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-raised text-label-md text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Employé</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Statut</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Poste</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Téléphone</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((employee) => (
                <tr key={employee.id} className="bg-surface hover:bg-surface-hover">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-text-primary">{employee.displayName}</p>
                    <p className="text-text-muted">{employee.role ?? '—'}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <StatusBadge
                      label={employee.active ? 'Actif' : 'Inactif'}
                      tone={employee.active ? 'success' : 'neutral'}
                    />
                  </td>
                  <td className="hidden px-4 py-3 text-text-secondary md:table-cell">
                    {employee.poste ?? '—'}
                  </td>
                  <td className="hidden px-4 py-3 text-text-secondary lg:table-cell">
                    {employee.phone ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/employees/${employee.id}`}
                      className="text-body-sm font-medium text-status-info"
                    >
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
