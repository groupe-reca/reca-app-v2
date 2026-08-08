import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  createEmployeeSchema,
  employeeRoles,
  type CreateEmployeeFormValues,
} from '../schemas/employee.schema'
import { useCreateEmployee } from '../hooks/useCreateEmployee'

const fieldClass =
  'mt-1 h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-body-md focus-visible:outline-2 focus-visible:outline-focus'
const labelClass = 'text-label-md font-semibold text-text-secondary'
const errorClass = 'mt-1 text-body-sm text-status-danger'

export function EmployeeCreatePage() {
  const navigate = useNavigate()
  const createEmployee = useCreateEmployee()
  const { register, handleSubmit, formState } = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      prenom: '',
      nom: '',
      telephone: '',
      courriel: '',
      poste: '',
      role: '',
      dateEmbauche: '',
      notes: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    createEmployee.mutate(
      {
        prenom: values.prenom,
        nom: values.nom,
        ...(values.telephone ? { telephone: values.telephone } : {}),
        ...(values.courriel ? { courriel: values.courriel } : {}),
        ...(values.poste ? { poste: values.poste } : {}),
        ...(values.role ? { role: values.role } : {}),
        ...(values.dateEmbauche ? { dateEmbauche: values.dateEmbauche } : {}),
        ...(values.notes ? { notes: values.notes } : {}),
      },
      {
        onSuccess: (id) => {
          void navigate(`/employees/${id}`)
        },
      },
    )
  })

  return (
    <div className="mx-auto max-w-[720px] space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="text-heading-xl font-bold">Créer un employé</h1>
        <p className="mt-1 text-body-sm text-text-muted">
          Enregistrement d’un nouvel employé.
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
              <label htmlFor="poste" className={labelClass}>
                Poste
              </label>
              <input id="poste" className={fieldClass} {...register('poste')} />
            </div>
            <div>
              <label htmlFor="role" className={labelClass}>
                Rôle
              </label>
              <select id="role" className={fieldClass} {...register('role')}>
                <option value="">—</option>
                {employeeRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dateEmbauche" className={labelClass}>
              Date d’embauche
            </label>
            <input
              id="dateEmbauche"
              type="date"
              className={fieldClass}
              {...register('dateEmbauche')}
            />
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Notes
            </label>
            <textarea
              id="notes"
              rows={4}
              className="mt-1 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-body-md focus-visible:outline-2 focus-visible:outline-focus"
              {...register('notes')}
            />
          </div>

          {createEmployee.isError ? (
            <p role="alert" className="text-body-sm text-status-danger">
              Une erreur est survenue lors de la création de l’employé. Réessayez.
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                void navigate('/employees')
              }}
            >
              Annuler
            </Button>
            <Button type="submit" loading={createEmployee.isPending}>
              Créer l’employé
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
