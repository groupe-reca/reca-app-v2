import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatTile } from '@/components/ui/StatTile'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { missionStatusMeta } from '@/domain/missionStatus'
import { useMissions } from '@/features/missions'

// Example/placeholder content — these two panels depend on modules not
// built yet (Contracts, a real event/audit log) so they stay as
// illustrative mock data, clearly separated from the real Missions
// data above. Wire to real sources once those modules exist.
const attentionItems = [
  {
    id: 'a1',
    severity: 'warning' as const,
    text: '3 contrats actifs n’ont pas de zone de déneigement définie',
    to: '/contracts/new',
  },
]

const recentActivity = [
  {
    id: 'e1',
    text: 'Exemple : Julie Bergeron a démarré une mission',
    time: 'il y a 7 min',
  },
  { id: 'e2', text: 'Exemple : problème signalé sur une mission', time: 'il y a 22 min' },
]

export function DashboardPage() {
  const { data: missions, isLoading, isError } = useMissions()
  const activeMissions = (missions ?? []).filter((m) => m.status === 'IN_PROGRESS')
  const toPrep = (missions ?? []).filter((m) => m.status === 'PLANNED')
  const problemCount = (missions ?? []).filter((m) => m.hasProblem).length

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display-md font-bold">Bonjour</h1>
          <p className="text-body-md text-text-secondary mt-1">
            Jeudi 7 août 2026 —{' '}
            <StatusBadge
              label={problemCount > 0 ? 'Attention requise' : 'Normal'}
              tone={problemCount > 0 ? 'warning' : 'success'}
            />
          </p>
        </div>
        <Button>Créer une mission</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Missions en cours"
          value={String(activeMissions.length)}
          tone="success"
        />
        <StatTile label="À préparer" value={String(toPrep.length)} tone="info" />
        <StatTile label="Problèmes ouverts" value={String(problemCount)} tone="danger" />
        <StatTile label="Synchronisation" value="—" tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader
              title="Missions actives"
              meta={
                isLoading ? 'Chargement…' : `${String(activeMissions.length)} en cours`
              }
              action={
                <Link
                  to="/missions"
                  className="text-body-sm text-status-info font-medium"
                >
                  Tout voir
                </Link>
              }
            />
            {isError ? (
              <p className="text-body-sm text-status-danger">
                Impossible de charger les missions.
              </p>
            ) : !isLoading && activeMissions.length === 0 ? (
              <EmptyState
                title="Aucune mission active"
                description="Aucune mission en cours n’a été trouvée. Si des données existent en base, l’authentification (RLS: rôle authenticated) est peut-être requise pour les voir."
              />
            ) : (
              <ul className="space-y-3">
                {activeMissions.map((mission) => {
                  const meta = missionStatusMeta[mission.status]
                  return (
                    <li key={mission.id}>
                      <Link
                        to={`/missions/${mission.id}`}
                        className="border-border hover:bg-surface-hover block rounded-lg border p-3 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-text-primary font-semibold">
                            {mission.numero !== null
                              ? `Mission #${String(mission.numero)}`
                              : 'Mission'}
                          </p>
                          <StatusBadge label={meta.label} tone={meta.tone} />
                        </div>
                        <p className="text-body-sm text-text-muted mt-0.5">
                          {mission.routeName}
                        </p>
                        <div className="mt-2">
                          <ProgressBar
                            value={mission.itemsDone}
                            max={mission.itemsTotal}
                          />
                        </div>
                        <p className="text-body-sm text-text-secondary mt-2">
                          {mission.operatorName} · {mission.equipmentName}
                          {mission.hasProblem ? (
                            <span className="text-status-danger ml-2 font-medium">
                              Problème signalé
                            </span>
                          ) : null}
                        </p>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Carte des opérations"
              meta="Intégration cartographique — à venir"
            />
            <div className="border-border text-body-sm text-text-muted flex h-48 items-center justify-center rounded-lg border border-dashed">
              La carte des opérations (Mapbox) sera ajoutée avec les modules
              Routes/Missions.
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title="À traiter"
              meta={`${String(attentionItems.length)} éléments (exemple)`}
            />
            <ul className="space-y-2">
              {attentionItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    className="text-body-sm text-text-secondary hover:bg-surface-hover flex items-start gap-2 rounded-md p-2"
                  >
                    <StatusBadge
                      label=" "
                      tone={item.severity}
                      className="mt-0.5 px-1.5"
                    />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Activité récente" meta="Exemple" />
            <ul className="space-y-3">
              {recentActivity.map((event) => (
                <li key={event.id} className="text-body-sm">
                  <p className="text-text-secondary">{event.text}</p>
                  <p className="text-caption text-text-muted">{event.time}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
