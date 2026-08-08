import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { paymentMethods } from '@/domain/invoiceStatus'
import { createPaymentSchema, type CreatePaymentFormValues } from '../schemas/payment.schema'
import { useCreatePayment } from '../hooks/useCreatePayment'

const fieldClass =
  'mt-1 h-10 w-full rounded-md border border-border-strong bg-surface px-3 text-body-sm focus-visible:outline-2 focus-visible:outline-focus'
const labelClass = 'text-label-sm font-semibold text-text-secondary'
const errorClass = 'mt-1 text-body-sm text-status-danger'

interface RecordPaymentFormProps {
  invoiceId: string
  onRecorded?: () => void
}

export function RecordPaymentForm({ invoiceId, onRecorded }: RecordPaymentFormProps) {
  const createPayment = useCreatePayment()
  const { register, handleSubmit, formState, reset } = useForm<CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      montant: '',
      methode: '',
      reference: '',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    createPayment.mutate(
      {
        invoiceId,
        amountCents: Math.round(Number(values.montant) * 100),
        date: values.date,
        ...(values.methode ? { method: values.methode } : {}),
        ...(values.reference ? { reference: values.reference } : {}),
        ...(values.notes ? { notes: values.notes } : {}),
      },
      {
        onSuccess: () => {
          reset()
          onRecorded?.()
        },
      },
    )
  })

  return (
    <form
      onSubmit={(event) => {
        void onSubmit(event)
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="montant" className={labelClass}>
            Montant ($)
          </label>
          <input id="montant" inputMode="decimal" className={fieldClass} {...register('montant')} />
          {formState.errors.montant ? (
            <p className={errorClass}>{formState.errors.montant.message}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="date" className={labelClass}>
            Date
          </label>
          <input id="date" type="date" className={fieldClass} {...register('date')} />
          {formState.errors.date ? (
            <p className={errorClass}>{formState.errors.date.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="methode" className={labelClass}>
            Méthode
          </label>
          <select id="methode" className={fieldClass} {...register('methode')}>
            <option value="">—</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="reference" className={labelClass}>
            Référence
          </label>
          <input id="reference" className={fieldClass} {...register('reference')} />
        </div>
      </div>

      {createPayment.isError ? (
        <p role="alert" className="text-body-sm text-status-danger">
          Une erreur est survenue lors de l’enregistrement du paiement. Réessayez.
        </p>
      ) : null}

      <Button type="submit" loading={createPayment.isPending}>
        Enregistrer le paiement
      </Button>
    </form>
  )
}
