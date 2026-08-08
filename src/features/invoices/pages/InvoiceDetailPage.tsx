import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatMoneyCAD } from '@/domain/money'
import { invoiceStatusMeta, invoiceStatusOrder } from '@/domain/invoiceStatus'
import { usePaymentsByInvoice } from '@/features/payments/hooks/usePaymentsByInvoice'
import { RecordPaymentForm } from '@/features/payments/components/RecordPaymentForm'
import { useInvoice } from '../hooks/useInvoice'
import { useUpdateInvoiceStatus } from '../hooks/useUpdateInvoiceStatus'

export function InvoiceDetailPage() {
  const { invoiceId } = useParams()
  const { data: invoice, isLoading, isError } = useInvoice(invoiceId)
  const updateStatus = useUpdateInvoiceStatus(invoiceId ?? '')
  const { data: payments } = usePaymentsByInvoice(invoiceId)

  if (isLoading) {
    return <div className="p-8 text-body-sm text-text-muted">Chargement…</div>
  }

  if (isError || !invoice) {
    return (
      <div className="p-8">
        <EmptyState
          title="Facture introuvable"
          description="Vérifiez le lien, ou l’authentification requise pour lire cette donnée n’est pas encore en place."
        />
      </div>
    )
  }

  const meta = invoiceStatusMeta[invoice.status]

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">
            Facture ·{' '}
            <Link to={`/clients/${invoice.clientId}`} className="text-status-info hover:underline">
              {invoice.clientDisplayName ?? '—'}
            </Link>
          </p>
          <h1 className="text-heading-xl font-bold">{invoice.numero ?? '—'}</h1>
          <p className="mt-1 text-body-md text-text-secondary">
            {new Date(invoice.date).toLocaleDateString('fr-CA')}
            {invoice.contractId ? (
              <>
                {' · '}
                <Link
                  to={`/contracts/${invoice.contractId}`}
                  className="text-status-info hover:underline"
                >
                  {invoice.contractNumero ?? 'Contrat lié'}
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <StatusBadge label={meta.label} tone={meta.tone} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Sous-total</p>
          <p className="mt-1 text-body-md font-medium tabular-nums">
            {formatMoneyCAD(invoice.subtotalCents)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">TPS + TVQ</p>
          <p className="mt-1 text-body-md font-medium tabular-nums">
            {formatMoneyCAD(invoice.tpsCents + invoice.tvqCents)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Total</p>
          <p className="mt-1 text-body-md font-bold tabular-nums">
            {formatMoneyCAD(invoice.totalCents)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Solde</p>
          <p className="mt-1 text-body-md font-bold tabular-nums">
            {formatMoneyCAD(invoice.balanceCents)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Paiements" meta={`${String(payments?.length ?? 0)} au total`} />
            {payments && payments.length > 0 ? (
              <ul className="divide-y divide-border">
                {payments.map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div>
                      <p className="text-body-sm font-medium text-text-primary">
                        {new Date(payment.date).toLocaleDateString('fr-CA')}
                        {payment.method ? ` · ${payment.method}` : ''}
                      </p>
                      {payment.reference ? (
                        <p className="text-body-sm text-text-muted">Réf. {payment.reference}</p>
                      ) : null}
                    </div>
                    <span className="text-body-sm font-semibold tabular-nums text-status-success">
                      {formatMoneyCAD(payment.amountCents)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-body-sm text-text-muted">Aucun paiement enregistré.</p>
            )}
          </Card>

          <Card>
            <CardHeader title="Enregistrer un paiement" />
            <RecordPaymentForm invoiceId={invoiceId ?? ''} />
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Changer le statut" />
            <div className="flex flex-col gap-2">
              {invoiceStatusOrder.map((status) => {
                const statusMeta = invoiceStatusMeta[status]
                const isCurrent = status === invoice.status
                return (
                  <Button
                    key={status}
                    variant={isCurrent ? 'primary' : 'secondary'}
                    disabled={isCurrent || updateStatus.isPending}
                    onClick={() => {
                      updateStatus.mutate(status)
                    }}
                  >
                    {statusMeta.label}
                  </Button>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
