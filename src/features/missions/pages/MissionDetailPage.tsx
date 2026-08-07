import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { missionStatusMeta } from '@/domain/missionStatus'
import { useMission } from '../hooks/useMission'

const itemStatusMeta = {
  terminee: { label: 'Terminé', tone: 'success' as const },
  en_cours: { label: 'En cours', tone: 'info' as const },
  en_attente: { label: 'À faire', tone: 'neutral' as const },
  a_reprendre: { label: 'À reprendre', tone: 'warning' as const },
  impossible: { label: 'Impossible', tone: 'danger' as const },
}

export function MissionDetailPage() {
  const { missionId } = useParams()
  const { data: mission, isLoading, isError } = useMission(missionId)

  if (isLoading) {
    return <div className="text-body-sm text-text-muted p-8">Chargement…</div>
  }

  if (isError || !mission) {
    return (
      <div className="p-8">
        <EmptyState
          title="Mission introuvable"
          description="Vérifiez le lien, ou l’authentification requise pour lire cette donnée (RLS: rôle authenticated) n’est pas encore en place."
        />
      </div>
    )
  }

  const meta = missionStatusMeta[mission.status]

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">Mission</p>
          <h1 className="text-heading-xl font-bold">
            {mission.numero !== null ? `Mission #${String(mission.numero)}` : 'Mission'}
          </h1>
          <p className="text-body-md text-text-secondary mt-1">{mission.routeName}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge label={meta.label} tone={meta.tone} />
          <Button variant="secondary">Assigner</Button>
          <Button>Démarrer</Button>
        </div>
      </div>

      {mission.hasProblem ? (
        <div className="border-status-danger/40 bg-status-danger-soft text-body-sm text-status-danger rounded-lg border px-4 py-3">
          Un problème a été signalé sur cette mission et nécessite une intervention.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader
              title="Progression"
              meta={`${String(mission.itemsDone)}/${String(mission.itemsTotal)} résidences`}
            />
            <ProgressBar value={mission.itemsDone} max={mission.itemsTotal} />
          </Card>

          <Card>
            <CardHeader
              title="Carte de la mission"
              meta="Intégration cartographique — à venir"
            />
            <div className="border-border text-body-sm text-text-muted flex h-56 items-center justify-center rounded-lg border border-dashed">
              La carte (Mapbox) affichera la route, les résidences et la position de
              l’opérateur.
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Résidences"
              meta={`${String(mission.items.length)} éléments`}
            />
            {mission.items.length === 0 ? (
              <p className="text-body-sm text-text-muted">
                Aucune résidence sur cette mission.
              </p>
            ) : (
              <ul className="divide-border divide-y">
                {mission.items.map((item) => {
                  const itemMeta = itemStatusMeta[item.status]
                  return (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <span className="text-body-sm text-text-primary">
                        {item.contractNumero ?? '—'} · {item.clientLabel}
                      </span>
                      <StatusBadge label={itemMeta.label} tone={itemMeta.tone} />
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Affectation" />
            <dl className="text-body-sm space-y-3">
              <div>
                <dt className="text-text-muted">Opérateur</dt>
                <dd className="text-text-primary font-medium">
                  {mission.operatorName ?? 'Non assigné'}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Équipement</dt>
                <dd className="text-text-primary font-medium">
                  {mission.equipmentName ?? 'Non assigné'}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Date</dt>
                <dd className="text-text-primary font-medium">{mission.date}</dd>
              </div>
            </dl>
          </Card>

          {mission.notes ? (
            <Card>
              <CardHeader title="Notes" />
              <p className="text-body-sm text-text-secondary">{mission.notes}</p>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
