import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { equipmentCategories } from '@/domain/equipmentStatus'
import {
  createEquipmentSchema,
  type CreateEquipmentFormValues,
} from '../schemas/equipment.schema'
import { useCreateEquipment } from '../hooks/useCreateEquipment'

const fieldClass =
  'mt-1 h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-body-md focus-visible:outline-2 focus-visible:outline-focus'
const labelClass = 'text-label-md font-semibold text-text-secondary'
const errorClass = 'mt-1 text-body-sm text-status-danger'

export function EquipmentCreatePage() {
  const navigate = useNavigate()
  const createEquipment = useCreateEquipment()
  const { register, handleSubmit, formState } = useForm<CreateEquipmentFormValues>({
    resolver: zodResolver(createEquipmentSchema),
    defaultValues: {
      nom: '',
      categorie: '',
      marque: '',
      modele: '',
      annee: '',
      plaque: '',
      numeroSerie: '',
      entretien: '',
      notes: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    createEquipment.mutate(
      {
        nom: values.nom,
        ...(values.categorie ? { categorie: values.categorie } : {}),
        ...(values.marque ? { marque: values.marque } : {}),
        ...(values.modele ? { modele: values.modele } : {}),
        ...(values.annee ? { annee: Number(values.annee) } : {}),
        ...(values.plaque ? { plaque: values.plaque } : {}),
        ...(values.numeroSerie ? { numeroSerie: values.numeroSerie } : {}),
        ...(values.entretien ? { entretien: values.entretien } : {}),
        ...(values.notes ? { notes: values.notes } : {}),
      },
      {
        onSuccess: (id) => {
          void navigate(`/equipments/${id}`)
        },
      },
    )
  })

  return (
    <div className="mx-auto max-w-[720px] space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="text-heading-xl font-bold">Créer un équipement</h1>
        <p className="mt-1 text-body-sm text-text-muted">
          Enregistrement d’un nouvel équipement. Le statut par défaut est « Disponible ».
        </p>
      </div>

      <Card>
        <form
          onSubmit={(event) => {
            void onSubmit(event)
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nom" className={labelClass}>
                Nom
              </label>
              <input id="nom" className={fieldClass} {...register('nom')} />
              {formState.errors.nom ? (
                <p className={errorClass}>{formState.errors.nom.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="categorie" className={labelClass}>
                Catégorie
              </label>
              <select id="categorie" className={fieldClass} {...register('categorie')}>
                <option value="">—</option>
                {equipmentCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="marque" className={labelClass}>
                Marque
              </label>
              <input id="marque" className={fieldClass} {...register('marque')} />
            </div>
            <div>
              <label htmlFor="modele" className={labelClass}>
                Modèle
              </label>
              <input id="modele" className={fieldClass} {...register('modele')} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="annee" className={labelClass}>
                Année
              </label>
              <input id="annee" inputMode="numeric" className={fieldClass} {...register('annee')} />
              {formState.errors.annee ? (
                <p className={errorClass}>{formState.errors.annee.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="plaque" className={labelClass}>
                Plaque
              </label>
              <input id="plaque" className={fieldClass} {...register('plaque')} />
            </div>
          </div>

          <div>
            <label htmlFor="numeroSerie" className={labelClass}>
              Numéro de série
            </label>
            <input id="numeroSerie" className={fieldClass} {...register('numeroSerie')} />
          </div>

          <div>
            <label htmlFor="entretien" className={labelClass}>
              Entretien
            </label>
            <textarea
              id="entretien"
              rows={3}
              className="mt-1 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-body-md focus-visible:outline-2 focus-visible:outline-focus"
              {...register('entretien')}
            />
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="mt-1 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-body-md focus-visible:outline-2 focus-visible:outline-focus"
              {...register('notes')}
            />
          </div>

          {createEquipment.isError ? (
            <p role="alert" className="text-body-sm text-status-danger">
              Une erreur est survenue lors de la création de l’équipement. Réessayez.
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                void navigate('/equipments')
              }}
            >
              Annuler
            </Button>
            <Button type="submit" loading={createEquipment.isPending}>
              Créer l’équipement
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
