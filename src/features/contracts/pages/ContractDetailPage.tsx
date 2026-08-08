import { Link, useParams } from 'react-router-dom'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { contractStatusMeta } from '@/domain/clientStatus'
import { formatMoneyCAD } from '@/domain/money'
import { useContract } from '../hooks/useContract'

export function ContractDetailPage() {
  const { contractId } = useParams()
  const { data: contract, isLoading, isError } = useContract(contractId)

  if (isLoading) {
    return <div className="text-body-sm text-text-muted p-8">Chargement…</div>
  }

  if (isError || !contract) {
    return (
      <div className="p-8">
        <EmptyState
          title="Contrat introuvable"
          description="Vérifiez le lien, ou l’authentification requise pour lire cette donnée n’est pas encore en place."
        />
      </div>
    )
  }

  const meta = contractStatusMeta[contract.status]

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">Contrat</p>
          <h1 className="text-heading-xl font-bold">{contract.numero ?? '—'}</h1>
          <p className="text-body-md text-text-secondary mt-1">
            <Link
              to={`/clients/${contract.clientId}`}
              className="text-status-info hover:underline"
            >
              {contract.clientName}
            </Link>
          </p>
        </div>
        <StatusBadge label={meta.label} tone={meta.tone} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Prix</p>
          <p className="text-heading-lg mt-1 font-bold tabular-nums">
            {contract.priceCents !== null ? formatMoneyCAD(contract.priceCents) : '—'}
          </p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Type</p>
          <p className="text-body-md mt-1 font-medium">
            {[contract.type, contract.saison].filter(Boolean).join(' · ') || '—'}
          </p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Début</p>
          <p className="text-body-md mt-1 font-medium">{contract.dateDebut ?? '—'}</p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Fin</p>
          <p className="text-body-md mt-1 font-medium">{contract.dateFin ?? '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Adresse" />
            <p className="text-body-sm text-text-secondary">
              {contract.address ?? 'Adresse non renseignée'}
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Notes" />
            <p className="text-body-sm text-text-muted">
              {contract.notes ?? 'Aucune note pour ce contrat.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
