import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { missionStatusMeta, type MissionStatus } from '@/domain/missionStatus'
import { mockMissions } from '../mocks'

const filterChips: { label: string; status: MissionStatus | 'ALL' }[] = [
  { label: 'Toutes', status: 'ALL' },
  { label: 'En cours', status: 'IN_PROGRESS' },
  { label: 'Prêtes', status: 'READY' },
  { label: 'Planifiées', status: 'PLANNED' },
  { label: 'Terminées', status: 'COMPLETED' },
]

export function MissionListPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<MissionStatus | 'ALL'>('ALL')

  const missions = useMemo(() => {
    return mockMissions.filter((mission) => {
      const matchesStatus = statusFilter === 'ALL' || mission.status === statusFilter
      const matchesQuery =
        query.trim().length === 0 ||
        mission.number.toLowerCase().includes(query.toLowerCase()) ||
        mission.routeName.toLowerCase().includes(query.toLowerCase())
      return matchesStatus && matchesQuery
    })
  }, [query, statusFilter])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-xl font-bold">Missions</h1>
          <p className="text-body-sm text-text-muted mt-1">
            {missions.length} mission{missions.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button>Créer une mission</Button>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
        placeholder="Rechercher par numéro ou route…"
        className="border-border-strong bg-surface text-body-md placeholder:text-text-muted focus-visible:outline-focus h-11 w-full rounded-md border px-3 focus-visible:outline-2 sm:max-w-sm"
      />

      <div className="flex flex-wrap gap-2">
        {filterChips.map((chip) => (
          <button
            key={chip.status}
            type="button"
            onClick={() => {
              setStatusFilter(chip.status)
            }}
            className={`rounded-pill text-body-sm border px-3 py-1.5 font-medium transition-colors ${
              statusFilter === chip.status
                ? 'border-brand-red bg-brand-red/10 text-brand-red'
                : 'border-border-strong text-text-secondary hover:bg-surface-hover'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {missions.length === 0 ? (
        <EmptyState
          title="Aucune mission trouvée"
          description="Essayez d’ajuster la recherche ou les filtres."
        />
      ) : (
        <div className="rounded-card border-border overflow-hidden border">
          <table className="text-body-sm w-full text-left">
            <thead className="bg-surface-raised text-label-md text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Mission</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Statut</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">
                  Opérateur
                </th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">
                  Progression
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {missions.map((mission) => {
                const meta = missionStatusMeta[mission.status]
                return (
                  <tr key={mission.id} className="bg-surface hover:bg-surface-hover">
                    <td className="px-4 py-3">
                      <p className="text-text-primary font-semibold">{mission.number}</p>
                      <p className="text-text-muted">{mission.routeName}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </td>
                    <td className="text-text-secondary hidden px-4 py-3 md:table-cell">
                      {mission.operatorName ?? '—'}
                    </td>
                    <td className="hidden w-40 px-4 py-3 lg:table-cell">
                      <ProgressBar value={mission.itemsDone} max={mission.itemsTotal} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/missions/${mission.id}`}
                        className="text-body-sm text-status-info font-medium"
                      >
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
