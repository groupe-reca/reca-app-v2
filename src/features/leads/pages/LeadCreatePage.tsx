import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createLeadSchema, type CreateLeadFormValues } from '../schemas/lead.schema'
import { useCreateLead } from '../hooks/useCreateLead'

const fieldClass =
  'mt-1 h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-body-md focus-visible:outline-2 focus-visible:outline-focus'
const labelClass = 'text-label-md font-semibold text-text-secondary'
const errorClass = 'mt-1 text-body-sm text-status-danger'

export function LeadCreatePage() {
  const navigate = useNavigate()
  const createLead = useCreateLead()
  const { register, handleSubmit, formState } = useForm<CreateLeadFormValues>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      prenom: '',
      nom: '',
      telephone: '',
      courriel: '',
      adresse: '',
      ville: '',
      typeService: '',
      message: '',
      source: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    createLead.mutate(
      {
        prenom: values.prenom,
        nom: values.nom,
        ...(values.telephone ? { telephone: values.telephone } : {}),
        ...(values.courriel ? { courriel: values.courriel } : {}),
        ...(values.adresse ? { adresse: values.adresse } : {}),
        ...(values.ville ? { ville: values.ville } : {}),
        ...(values.typeService ? { typeService: values.typeService } : {}),
        ...(values.message ? { message: values.message } : {}),
        ...(values.source ? { source: values.source } : {}),
      },
      {
        onSuccess: (id) => {
          void navigate(`/leads/${id}`)
        },
      },
    )
  })

  return (
    <div className="mx-auto max-w-[720px] space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="text-heading-xl font-bold">Créer un lead</h1>
        <p className="mt-1 text-body-sm text-text-muted">
          Enregistrement manuel d’un lead — mêmes champs que le formulaire public.
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
              <label htmlFor="prenom" className={labelClass}>
                Prénom
              </label>
              <input id="prenom" className={fieldClass} {...register('prenom')} />
              {formState.errors.prenom ? (
                <p className={errorClass}>{formState.errors.prenom.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="nom" className={labelClass}>
                Nom
              </label>
              <input id="nom" className={fieldClass} {...register('nom')} />
              {formState.errors.nom ? (
                <p className={errorClass}>{formState.errors.nom.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="telephone" className={labelClass}>
                Téléphone
              </label>
              <input id="telephone" className={fieldClass} {...register('telephone')} />
            </div>
            <div>
              <label htmlFor="courriel" className={labelClass}>
                Courriel
              </label>
              <input
                id="courriel"
                type="email"
                className={fieldClass}
                {...register('courriel')}
              />
              {formState.errors.courriel ? (
                <p className={errorClass}>{formState.errors.courriel.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="adresse" className={labelClass}>
                Adresse
              </label>
              <input id="adresse" className={fieldClass} {...register('adresse')} />
            </div>
            <div>
              <label htmlFor="ville" className={labelClass}>
                Ville
              </label>
              <input id="ville" className={fieldClass} {...register('ville')} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="typeService" className={labelClass}>
                Service demandé
              </label>
              <input id="typeService" className={fieldClass} {...register('typeService')} />
            </div>
            <div>
              <label htmlFor="source" className={labelClass}>
                Source
              </label>
              <input id="source" className={fieldClass} {...register('source')} />
            </div>
          </div>

          <div>
            <label htmlFor="message" className={labelClass}>
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="mt-1 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-body-md focus-visible:outline-2 focus-visible:outline-focus"
              {...register('message')}
            />
          </div>

          {createLead.isError ? (
            <p role="alert" className="text-body-sm text-status-danger">
              Une erreur est survenue lors de la création du lead. Réessayez.
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                void navigate('/leads')
              }}
            >
              Annuler
            </Button>
            <Button type="submit" loading={createLead.isPending}>
              Créer le lead
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
