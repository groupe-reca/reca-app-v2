import { Link, useParams } from 'react-router-dom'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { contractStatusMeta } from '@/domain/clientStatus'
import { useRoute } from '../hooks/useRoute'

export function RouteDetailPage() {
  const { routeId } = useParams()
  const { data: route, isLoading, isError } = useRoute(routeId)

  if (isLoading) {
    return <div className="text-body-sm text-text-muted p-8">Chargement…</div>
  }

  if (isError || !route) {
    return (
      <div className="p-8">
        <EmptyState
          title="Route introuvable"
          description="Vérifiez le lien, ou l’authentification requise pour lire cette donnée n’est pas encore en place."
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">Route</p>
          <div className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: route.couleur }}
              aria-hidden="true"
            />
            <h1 className="text-heading-xl font-bold">{route.nom}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Opérateur</p>
          <p className="text-body-md mt-1 font-medium">
            {route.operatorName ?? 'Non assigné'}
          </p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Équipement</p>
          <p className="text-body-md mt-1 font-medium">
            {route.equipmentName ?? 'Non assigné'}
          </p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Contrats</p>
          <p className="text-heading-lg mt-1 font-bold tabular-nums">
            {route.contracts.length}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Contrats assignés"
          meta={`${String(route.contracts.length)} au total, ordre de visite`}
        />
        {route.contracts.length === 0 ? (
          <p className="text-body-sm text-text-muted">
            Aucun contrat assigné à cette route.
          </p>
        ) : (
          <ol className="divide-border divide-y">
            {route.contracts.map((contract) => {
              const meta = contractStatusMeta[contract.status]
              return (
                <li
                  key={contract.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-body-sm text-text-muted w-6 tabular-nums">
                      {contract.ordre + 1}
                    </span>
                    <div>
                      <Link
                        to={`/contracts/${contract.contractId}`}
                        className="text-body-sm text-status-info font-semibold hover:underline"
                      >
                        {contract.contractNumero ?? '—'}
                      </Link>
                      <p className="text-body-sm text-text-muted">
                        {contract.address ?? 'Adresse non renseignée'}
                      </p>
                    </div>
                  </div>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </li>
              )
            })}
          </ol>
        )}
      </Card>
    </div>
  )
}
