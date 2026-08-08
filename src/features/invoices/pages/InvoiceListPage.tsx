import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatMoneyCAD } from '@/domain/money'
import { invoiceStatusMeta, invoiceStatusOrder, type InvoiceStatus } from '@/domain/invoiceStatus'
import { useInvoices } from '../hooks/useInvoices'

const filterChips: { label: string; status: InvoiceStatus | 'ALL' }[] = [
  { label: 'Tous', status: 'ALL' },
  ...invoiceStatusOrder.map((status) => ({ label: invoiceStatusMeta[status].label, status })),
]

export function InvoiceListPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL')
  const { data: allInvoices, isLoading, isError } = useInvoices()

  const invoices = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (allInvoices ?? []).filter((invoice) => {
      const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter
      const matchesQuery =
        q.length === 0 ||
        (invoice.numero ?? '').toLowerCase().includes(q) ||
        (invoice.clientDisplayName ?? '').toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [allInvoices, query, statusFilter])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-xl font-bold">Factures</h1>
          <p className="mt-1 text-body-sm text-text-muted">
            {isLoading
              ? 'Chargement…'
              : `${String(invoices.length)} facture${invoices.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/invoices/new">
          <Button>Créer une facture</Button>
        </Link>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
        placeholder="Rechercher par numéro ou client…"
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
          title="Impossible de charger les factures"
          description="Une erreur est survenue lors de la lecture des données. Réessayez plus tard."
        />
      ) : !isLoading && invoices.length === 0 ? (
        <EmptyState
          title="Aucune facture trouvée"
          description="Essayez d’ajuster la recherche ou les filtres, ou créez une nouvelle facture."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-border">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-raised text-label-md text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Facture</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Statut</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Client</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Total</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Solde</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => {
                const meta = invoiceStatusMeta[invoice.status]
                return (
                  <tr key={invoice.id} className="bg-surface hover:bg-surface-hover">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-text-primary">{invoice.numero ?? '—'}</p>
                      <p className="text-text-muted">
                        {new Date(invoice.date).toLocaleDateString('fr-CA')}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </td>
                    <td className="hidden px-4 py-3 text-text-secondary md:table-cell">
                      {invoice.clientDisplayName ?? '—'}
                    </td>
                    <td className="hidden px-4 py-3 text-text-secondary tabular-nums lg:table-cell">
                      {formatMoneyCAD(invoice.totalCents)}
                    </td>
                    <td className="hidden px-4 py-3 text-text-secondary tabular-nums lg:table-cell">
                      {formatMoneyCAD(invoice.balanceCents)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/invoices/${invoice.id}`}
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
