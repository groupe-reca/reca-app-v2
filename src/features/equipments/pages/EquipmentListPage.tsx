import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  equipmentStatusMeta,
  equipmentStatusOrder,
  type EquipmentStatus,
} from '@/domain/equipmentStatus'
import { useEquipments } from '../hooks/useEquipments'

const filterChips: { label: string; status: EquipmentStatus | 'ALL' }[] = [
  { label: 'Tous', status: 'ALL' },
  ...equipmentStatusOrder.map((status) => ({ label: equipmentStatusMeta[status].label, status })),
]

export function EquipmentListPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | 'ALL'>('ALL')
  const { data: allEquipments, isLoading, isError } = useEquipments()

  const equipments = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (allEquipments ?? []).filter((equipment) => {
      const matchesStatus = statusFilter === 'ALL' || equipment.status === statusFilter
      const matchesQuery =
        q.length === 0 ||
        equipment.nom.toLowerCase().includes(q) ||
        (equipment.numero ?? '').toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [allEquipments, query, statusFilter])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-xl font-bold">Équipements</h1>
          <p className="mt-1 text-body-sm text-text-muted">
            {isLoading
              ? 'Chargement…'
              : `${String(equipments.length)} équipement${equipments.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/equipments/new">
          <Button>Créer un équipement</Button>
        </Link>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
        placeholder="Rechercher par nom ou numéro…"
        className="h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-body-md placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-focus sm:max-w-sm"
      />

      <div className="flex flex-wrap gap-2">
        {filterChips.map((chip) => (
          <button
            key={chip.status}
            type="button"
            onClick={() => {
              setStatusFilter(chip.status)
            }}
            className={`rounded-pill border px-3 py-1.5 text-body-sm font-medium transition-colors ${
              statusFilter === chip.status
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
          title="Impossible de charger les équipements"
          description="Une erreur est survenue lors de la lecture des données. Réessayez plus tard."
        />
      ) : !isLoading && equipments.length === 0 ? (
        <EmptyState
          title="Aucun équipement trouvé"
          description="Essayez d’ajuster la recherche ou les filtres, ou créez un nouvel équipement."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-border">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-raised text-label-md text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Équipement</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Statut</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Catégorie</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {equipments.map((equipment) => {
                const meta = equipmentStatusMeta[equipment.status]
                return (
                  <tr key={equipment.id} className="bg-surface hover:bg-surface-hover">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-text-primary">{equipment.nom}</p>
                      <p className="text-text-muted">{equipment.numero ?? '—'}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </td>
                    <td className="hidden px-4 py-3 text-text-secondary md:table-cell">
                      {equipment.categorie ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/equipments/${equipment.id}`}
                        className="text-body-sm font-medium text-status-info"
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
