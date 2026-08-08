import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createQuoteSchema, type CreateQuoteFormValues } from '../schemas/quote.schema'
import { useCreateQuote } from '../hooks/useCreateQuote'

const fieldClass =
  'mt-1 h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-body-md focus-visible:outline-2 focus-visible:outline-focus'
const labelClass = 'text-label-md font-semibold text-text-secondary'
const errorClass = 'mt-1 text-body-sm text-status-danger'

export function QuoteCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const leadId = searchParams.get('leadId') ?? undefined
  const createQuote = useCreateQuote()
  const { register, handleSubmit, formState } = useForm<CreateQuoteFormValues>({
    resolver: zodResolver(createQuoteSchema),
    defaultValues: { montant: '', taxes: '', expiration: '', notes: '' },
  })

  const onSubmit = handleSubmit((values) => {
    createQuote.mutate(
      {
        ...(leadId ? { leadId } : {}),
        amountCents: Math.round(Number(values.montant) * 100),
        taxesCents: Math.round(Number(values.taxes) * 100),
        ...(values.expiration ? { expiration: values.expiration } : {}),
        ...(values.notes ? { notes: values.notes } : {}),
      },
      {
        onSuccess: (id) => {
          void navigate(`/quotes/${id}`)
        },
      },
    )
  })

  return (
    <div className="mx-auto max-w-[720px] space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="text-heading-xl font-bold">Créer une soumission</h1>
        <p className="mt-1 text-body-sm text-text-muted">
          {leadId
            ? 'Créée à partir d’un lead existant.'
            : 'Soumission créée sans lead d’origine.'}
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
              <label htmlFor="montant" className={labelClass}>
                Montant ($)
              </label>
              <input
                id="montant"
                inputMode="decimal"
                className={fieldClass}
                {...register('montant')}
              />
              {formState.errors.montant ? (
                <p className={errorClass}>{formState.errors.montant.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="taxes" className={labelClass}>
                Taxes ($)
              </label>
              <input
                id="taxes"
                inputMode="decimal"
                className={fieldClass}
                {...register('taxes')}
              />
              {formState.errors.taxes ? (
                <p className={errorClass}>{formState.errors.taxes.message}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="expiration" className={labelClass}>
              Date d’expiration
            </label>
            <input
              id="expiration"
              type="date"
              className={fieldClass}
              {...register('expiration')}
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

          {createQuote.isError ? (
            <p role="alert" className="text-body-sm text-status-danger">
              Une erreur est survenue lors de la création de la soumission. Réessayez.
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                void navigate('/quotes')
              }}
            >
              Annuler
            </Button>
            <Button type="submit" loading={createQuote.isPending}>
              Créer la soumission
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
