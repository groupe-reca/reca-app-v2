import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { equipmentStatusMeta, equipmentStatusOrder } from '@/domain/equipmentStatus'
import { useEquipment } from '../hooks/useEquipment'
import { useUpdateEquipmentStatus } from '../hooks/useUpdateEquipmentStatus'

export function EquipmentDetailPage() {
  const { equipmentId } = useParams()
  const { data: equipment, isLoading, isError } = useEquipment(equipmentId)
  const updateStatus = useUpdateEquipmentStatus(equipmentId ?? '')

  if (isLoading) {
    return <div className="p-8 text-body-sm text-text-muted">Chargement…</div>
  }

  if (isError || !equipment) {
    return (
      <div className="p-8">
        <EmptyState
          title="Équipement introuvable"
          description="Vérifiez le lien, ou l’authentification requise pour lire cette donnée n’est pas encore en place."
        />
      </div>
    )
  }

  const meta = equipmentStatusMeta[equipment.status]

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">Équipement · {equipment.numero ?? '—'}</p>
          <h1 className="text-heading-xl font-bold">{equipment.nom}</h1>
          <p className="mt-1 text-body-md text-text-secondary">{equipment.categorie ?? '—'}</p>
        </div>
        <StatusBadge label={meta.label} tone={meta.tone} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Marque / Modèle</p>
          <p className="mt-1 text-body-md font-medium">
            {[equipment.marque, equipment.modele].filter(Boolean).join(' ') || '—'}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Année</p>
          <p className="mt-1 text-body-md font-medium">{equipment.annee ?? '—'}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Plaque</p>
          <p className="mt-1 text-body-md font-medium">{equipment.plaque ?? '—'}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3">
          <p className="text-label-md text-text-muted">Numéro de série</p>
          <p className="mt-1 text-body-md font-medium">{equipment.numeroSerie ?? '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Entretien" />
            <p className="whitespace-pre-wrap text-body-sm text-text-secondary">
              {equipment.entretien ?? 'Aucun entretien noté.'}
            </p>
          </Card>

          <Card>
            <CardHeader title="Notes" />
            <p className="whitespace-pre-wrap text-body-sm text-text-secondary">
              {equipment.notes ?? 'Aucune note.'}
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Changer le statut" />
            <div className="flex flex-col gap-2">
              {equipmentStatusOrder.map((status) => {
                const statusMeta = equipmentStatusMeta[status]
                const isCurrent = status === equipment.status
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
