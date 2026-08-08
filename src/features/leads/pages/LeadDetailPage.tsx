import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { leadStatusMeta, leadStatusOrder } from '@/domain/leadStatus'
import { useLead } from '../hooks/useLead'
import { useUpdateLeadStatus } from '../hooks/useUpdateLeadStatus'

export function LeadDetailPage() {
  const { leadId } = useParams()
  const { data: lead, isLoading, isError } = useLead(leadId)
  const updateStatus = useUpdateLeadStatus(leadId ?? '')

  if (isLoading) {
    return <div className="p-8 text-body-sm text-text-muted">Chargement…</div>
  }

  if (isError || !lead) {
    return (
      <div className="p-8">
        <EmptyState
          title="Lead introuvable"
          description="Vérifiez le lien, ou l’authentification requise pour lire cette donnée n’est pas encore en place."
        />
      </div>
    )
  }

  const meta = leadStatusMeta[lead.status]

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">Lead · {lead.numero ?? '—'}</p>
          <h1 className="text-heading-xl font-bold">{lead.displayName}</h1>
          <p className="mt-1 text-body-md text-text-secondary">
            {lead.address ?? 'Adresse non renseignée'}
            {lead.city ? `, ${lead.city}` : ''}
          </p>
        </div>
        <StatusBadge label={meta.label} tone={meta.tone} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Service demandé</p>
          <p className="mt-1 text-body-md font-medium">{lead.typeService ?? '—'}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Téléphone</p>
          <p className="mt-1 text-body-md font-medium">{lead.phone ?? '—'}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Courriel</p>
          <p className="mt-1 truncate text-body-md font-medium">{lead.email ?? '—'}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Source</p>
          <p className="mt-1 text-body-md font-medium">{lead.source ?? '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Message" />
            <p className="whitespace-pre-wrap text-body-sm text-text-secondary">
              {lead.message ?? 'Aucun message.'}
            </p>
          </Card>

          {lead.reminderAt ? (
            <Card>
              <CardHeader title="Rappel" />
              <p className="text-body-sm text-text-secondary">
                {new Date(lead.reminderAt).toLocaleString('fr-CA')}
              </p>
              {lead.reminderNote ? (
                <p className="mt-1 text-body-sm text-text-muted">{lead.reminderNote}</p>
              ) : null}
            </Card>
          ) : null}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Changer le statut" />
            <div className="flex flex-col gap-2">
              {leadStatusOrder.map((status) => {
                const statusMeta = leadStatusMeta[status]
                const isCurrent = status === lead.status
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
