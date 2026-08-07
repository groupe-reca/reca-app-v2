import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { missionStatusMeta } from '@/domain/missionStatus'
import { mockMissions } from '../mocks'

const mockItems = [
  { id: 'i1', address: '224 rue Scott', status: 'DONE' as const },
  { id: 'i2', address: '318 rue Saint-Vallier O', status: 'DONE' as const },
  { id: 'i3', address: '55 avenue Belvédère', status: 'IN_PROGRESS' as const },
  { id: 'i4', address: '12 rue des Érables', status: 'PENDING' as const },
]

const itemStatusMeta = {
  DONE: { label: 'Terminé', tone: 'success' as const },
  IN_PROGRESS: { label: 'En cours', tone: 'info' as const },
  PENDING: { label: 'À faire', tone: 'neutral' as const },
}

export function MissionDetailPage() {
  const { missionId } = useParams()
  const mission = mockMissions.find((m) => m.id === missionId)

  if (!mission) {
    return (
      <div className="p-8">
        <EmptyState
          title="Mission introuvable"
          description="Vérifiez le lien ou revenez à la liste des missions."
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
          <h1 className="text-heading-xl font-bold">{mission.number}</h1>
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
              meta={`${String(mockItems.length)} éléments`}
            />
            <ul className="divide-border divide-y">
              {mockItems.map((item) => {
                const itemMeta = itemStatusMeta[item.status]
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <span className="text-body-sm text-text-primary">{item.address}</span>
                    <StatusBadge label={itemMeta.label} tone={itemMeta.tone} />
                  </li>
                )
              })}
            </ul>
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
                <dt className="text-text-muted">Dernière synchronisation</dt>
                <dd className="text-text-primary font-medium">
                  {mission.lastSyncMinutesAgo === null
                    ? 'Aucune donnée'
                    : `Il y a ${String(mission.lastSyncMinutesAgo)} min`}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader title="Historique" />
            <ul className="text-body-sm space-y-3">
              <li>
                <p className="text-text-secondary">Mission créée à partir de la route</p>
                <p className="text-caption text-text-muted">Aujourd’hui, 06:15</p>
              </li>
              <li>
                <p className="text-text-secondary">Opérateur et équipement assignés</p>
                <p className="text-caption text-text-muted">Aujourd’hui, 06:22</p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
