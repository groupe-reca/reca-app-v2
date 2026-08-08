import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { leadStatusMeta, leadStatusOrder, type LeadStatus } from '@/domain/leadStatus'
import { useLeads } from '../hooks/useLeads'

const filterChips: { label: string; status: LeadStatus | 'ALL' }[] = [
  { label: 'Tous', status: 'ALL' },
  ...leadStatusOrder.map((status) => ({ label: leadStatusMeta[status].label, status })),
]

export function LeadListPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL')
  const { data: allLeads, isLoading, isError } = useLeads()

  const leads = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (allLeads ?? []).filter((lead) => {
      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter
      const matchesQuery =
        q.length === 0 ||
        lead.displayName.toLowerCase().includes(q) ||
        (lead.numero ?? '').toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [allLeads, query, statusFilter])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-xl font-bold">Leads</h1>
          <p className="mt-1 text-body-sm text-text-muted">
            {isLoading ? 'Chargement…' : `${String(leads.length)} lead${leads.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/leads/new">
          <Button>Créer un lead</Button>
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
          title="Impossible de charger les leads"
          description="Une erreur est survenue lors de la lecture des données. Réessayez plus tard."
        />
      ) : !isLoading && leads.length === 0 ? (
        <EmptyState
          title="Aucun lead trouvé"
          description="Essayez d’ajuster la recherche ou les filtres, ou créez un nouveau lead."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-border">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-raised text-label-md text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Lead</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Statut</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Service</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Téléphone</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => {
                const meta = leadStatusMeta[lead.status]
                return (
                  <tr key={lead.id} className="bg-surface hover:bg-surface-hover">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-text-primary">{lead.displayName}</p>
                      <p className="text-text-muted">{lead.numero ?? '—'}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </td>
                    <td className="hidden px-4 py-3 text-text-secondary md:table-cell">
                      {lead.typeService ?? '—'}
                    </td>
                    <td className="hidden px-4 py-3 text-text-secondary lg:table-cell">
                      {lead.phone ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/leads/${lead.id}`}
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
