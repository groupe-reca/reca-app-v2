import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatMoneyCAD } from '@/domain/money'
import { quoteStatusMeta, quoteStatusOrder, type QuoteStatus } from '@/domain/quoteStatus'
import { useQuotes } from '../hooks/useQuotes'

const filterChips: { label: string; status: QuoteStatus | 'ALL' }[] = [
  { label: 'Tous', status: 'ALL' },
  ...quoteStatusOrder.map((status) => ({ label: quoteStatusMeta[status].label, status })),
]

export function QuoteListPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'ALL'>('ALL')
  const { data: allQuotes, isLoading, isError } = useQuotes()

  const quotes = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (allQuotes ?? []).filter((quote) => {
      const matchesStatus = statusFilter === 'ALL' || quote.status === statusFilter
      const matchesQuery =
        q.length === 0 ||
        (quote.numero ?? '').toLowerCase().includes(q) ||
        (quote.leadDisplayName ?? '').toLowerCase().includes(q) ||
        (quote.clientDisplayName ?? '').toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [allQuotes, query, statusFilter])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-xl font-bold">Soumissions</h1>
          <p className="mt-1 text-body-sm text-text-muted">
            {isLoading
              ? 'Chargement…'
              : `${String(quotes.length)} soumission${quotes.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/quotes/new">
          <Button>Créer une soumission</Button>
        </Link>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
        placeholder="Rechercher par numéro, lead ou client…"
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
          title="Impossible de charger les soumissions"
          description="Une erreur est survenue lors de la lecture des données. Réessayez plus tard."
        />
      ) : !isLoading && quotes.length === 0 ? (
        <EmptyState
          title="Aucune soumission trouvée"
          description="Essayez d’ajuster la recherche ou les filtres, ou créez une nouvelle soumission."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-border">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-raised text-label-md text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Soumission</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Statut</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Lead / Client</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes.map((quote) => {
                const meta = quoteStatusMeta[quote.status]
                return (
                  <tr key={quote.id} className="bg-surface hover:bg-surface-hover">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-text-primary">
                        {quote.numero ?? '—'}
                      </p>
                      <p className="text-text-muted">
                        {quote.expiration
                          ? `Expire le ${new Date(quote.expiration).toLocaleDateString('fr-CA')}`
                          : 'Sans date d’expiration'}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </td>
                    <td className="hidden px-4 py-3 text-text-secondary md:table-cell">
                      {quote.clientDisplayName ?? quote.leadDisplayName ?? '—'}
                    </td>
                    <td className="hidden px-4 py-3 text-text-secondary tabular-nums lg:table-cell">
                      {formatMoneyCAD(quote.totalCents)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/quotes/${quote.id}`}
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
