import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatMoneyCAD } from '@/domain/money'
import { usePayments } from '../hooks/usePayments'

export function PaymentListPage() {
  const [query, setQuery] = useState('')
  const { data: allPayments, isLoading, isError } = usePayments()

  const payments = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (allPayments ?? []).filter((payment) => {
      if (q.length === 0) return true
      return (
        (payment.invoiceNumero ?? '').toLowerCase().includes(q) ||
        (payment.reference ?? '').toLowerCase().includes(q) ||
        (payment.method ?? '').toLowerCase().includes(q)
      )
    })
  }, [allPayments, query])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 lg:p-8">
      <div>
        <h1 className="text-heading-xl font-bold">Paiements</h1>
        <p className="mt-1 text-body-sm text-text-muted">
          {isLoading
            ? 'Chargement…'
            : `${String(payments.length)} paiement${payments.length > 1 ? 's' : ''}`}
        </p>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
        placeholder="Rechercher par facture, référence ou méthode…"
        className="h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-body-md placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-focus sm:max-w-sm"
      />

      {isError ? (
        <EmptyState
          title="Impossible de charger les paiements"
          description="Une erreur est survenue lors de la lecture des données. Réessayez plus tard."
        />
      ) : !isLoading && payments.length === 0 ? (
        <EmptyState
          title="Aucun paiement trouvé"
          description="Les paiements sont enregistrés depuis la fiche d’une facture."
        />
      ) : (
        <div className="overflow-hidden rounded-card border border-border">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-raised text-label-md text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Facture</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Méthode</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Référence</th>
                <th className="px-4 py-3 text-right font-semibold">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((payment) => (
                <tr key={payment.id} className="bg-surface hover:bg-surface-hover">
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(payment.date).toLocaleDateString('fr-CA')}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/invoices/${payment.invoiceId}`}
                      className="font-semibold text-status-info hover:underline"
                    >
                      {payment.invoiceNumero ?? '—'}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-text-secondary sm:table-cell">
                    {payment.method ?? '—'}
                  </td>
                  <td className="hidden px-4 py-3 text-text-secondary md:table-cell">
                    {payment.reference ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-text-primary">
                    {formatMoneyCAD(payment.amountCents)}
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
