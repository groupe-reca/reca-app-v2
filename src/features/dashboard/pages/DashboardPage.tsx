import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatTile } from '@/components/ui/StatTile'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { missionStatusMeta } from '@/domain/missionStatus'
import { mockMissions } from '@/features/missions/mocks'

const attentionItems = [
  {
    id: 'a1',
    severity: 'danger' as const,
    text: 'MIS-2026-0042 signale un problème non résolu depuis 22 min',
    to: '/missions/m2',
  },
  {
    id: 'a2',
    severity: 'warning' as const,
    text: 'MIS-2026-0043 n’a pas d’équipement confirmé avant le départ',
    to: '/missions/m3',
  },
  {
    id: 'a3',
    severity: 'warning' as const,
    text: '3 contrats actifs n’ont pas de zone de déneigement définie',
    to: '/contracts/new',
  },
]

const recentActivity = [
  { id: 'e1', text: 'Julie Bergeron a démarré MIS-2026-0042', time: 'il y a 7 min' },
  { id: 'e2', text: 'Problème signalé sur MIS-2026-0042', time: 'il y a 22 min' },
  { id: 'e3', text: 'MIS-2026-0038 marquée terminée', time: 'il y a 1 h 12' },
]

export function DashboardPage() {
  const activeMissions = mockMissions.filter((m) => m.status === 'IN_PROGRESS')
  const toPrep = mockMissions.filter(
    (m) => m.status === 'PLANNED' || m.status === 'READY',
  )
  const problemCount = mockMissions.filter((m) => m.hasProblem).length

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
        <StatTile label="Synchronisation" value="5/6" tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader
              title="Missions actives"
              meta={`${String(activeMissions.length)} en cours`}
              action={
                <Link
                  to="/missions"
                  className="text-body-sm text-status-info font-medium"
                >
                  Tout voir
                </Link>
              }
            />
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
                          {mission.number}
                        </p>
                        <StatusBadge label={meta.label} tone={meta.tone} />
                      </div>
                      <p className="text-body-sm text-text-muted mt-0.5">
                        {mission.routeName}
                      </p>
                      <div className="mt-2">
                        <ProgressBar value={mission.itemsDone} max={mission.itemsTotal} />
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
              meta={`${String(attentionItems.length)} éléments`}
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
            <CardHeader title="Activité récente" />
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
