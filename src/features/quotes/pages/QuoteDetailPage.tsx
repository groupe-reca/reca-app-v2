import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatMoneyCAD } from '@/domain/money'
import { quoteStatusMeta, quoteStatusOrder } from '@/domain/quoteStatus'
import { useClients } from '@/features/clients/hooks/useClients'
import { useQuote } from '../hooks/useQuote'
import { useUpdateQuoteStatus } from '../hooks/useUpdateQuoteStatus'
import { useLinkQuoteToClient } from '../hooks/useLinkQuoteToClient'

export function QuoteDetailPage() {
  const { quoteId } = useParams()
  const { data: quote, isLoading, isError } = useQuote(quoteId)
  const updateStatus = useUpdateQuoteStatus(quoteId ?? '')
  const linkToClient = useLinkQuoteToClient(quoteId ?? '')
  const { data: clients } = useClients()
  const [selectedClientId, setSelectedClientId] = useState('')

  if (isLoading) {
    return <div className="p-8 text-body-sm text-text-muted">Chargement…</div>
  }

  if (isError || !quote) {
    return (
      <div className="p-8">
        <EmptyState
          title="Soumission introuvable"
          description="Vérifiez le lien, ou l’authentification requise pour lire cette donnée n’est pas encore en place."
        />
      </div>
    )
  }

  const meta = quoteStatusMeta[quote.status]

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">Soumission</p>
          <h1 className="text-heading-xl font-bold">{quote.numero ?? '—'}</h1>
          <p className="mt-1 text-body-md text-text-secondary">
            {quote.expiration
              ? `Expire le ${new Date(quote.expiration).toLocaleDateString('fr-CA')}`
              : 'Sans date d’expiration'}
          </p>
        </div>
        <StatusBadge label={meta.label} tone={meta.tone} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Montant</p>
          <p className="mt-1 text-body-md font-medium tabular-nums">
            {formatMoneyCAD(quote.amountCents)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Taxes</p>
          <p className="mt-1 text-body-md font-medium tabular-nums">
            {formatMoneyCAD(quote.taxesCents)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Total</p>
          <p className="mt-1 text-body-md font-bold tabular-nums">
            {formatMoneyCAD(quote.totalCents)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Lead d’origine</p>
          <p className="mt-1 truncate text-body-md font-medium">
            {quote.leadId ? (
              <Link to={`/leads/${quote.leadId}`} className="text-status-info hover:underline">
                {quote.leadDisplayName ?? '—'}
              </Link>
            ) : (
              '—'
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Notes" />
            <p className="whitespace-pre-wrap text-body-sm text-text-secondary">
              {quote.notes ?? 'Aucune note.'}
            </p>
          </Card>

          <Card>
            <CardHeader title="Client" />
            {quote.clientId ? (
              <p className="text-body-sm text-text-secondary">
                Liée au client{' '}
                <Link
                  to={`/clients/${quote.clientId}`}
                  className="font-semibold text-status-info hover:underline"
                >
                  {quote.clientDisplayName ?? '—'}
                </Link>
              </p>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={selectedClientId}
                  onChange={(event) => {
                    setSelectedClientId(event.target.value)
                  }}
                  className="h-11 flex-1 rounded-md border border-border-strong bg-surface px-3 text-body-md focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <option value="">Sélectionner un client existant…</option>
                  {(clients ?? []).map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.displayName}
                    </option>
                  ))}
                </select>
                <Button
                  disabled={!selectedClientId || linkToClient.isPending}
                  onClick={() => {
                    linkToClient.mutate(selectedClientId)
                  }}
                >
                  Lier au client
                </Button>
              </div>
            )}
            <p className="mt-2 text-body-sm text-text-muted">
              Lier une soumission suppose que le client existe déjà (créé séparément) — même
              logique que le système existant, qui ne crée pas de client depuis une soumission.
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Changer le statut" />
            <div className="flex flex-col gap-2">
              {quoteStatusOrder.map((status) => {
                const statusMeta = quoteStatusMeta[status]
                const isCurrent = status === quote.status
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
