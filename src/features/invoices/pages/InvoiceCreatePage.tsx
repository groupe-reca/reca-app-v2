import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useClients } from '@/features/clients/hooks/useClients'
import { useContracts } from '@/features/contracts/hooks/useContracts'
import { createInvoiceSchema, type CreateInvoiceFormValues } from '../schemas/invoice.schema'
import { useCreateInvoice } from '../hooks/useCreateInvoice'

const fieldClass =
  'mt-1 h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-body-md focus-visible:outline-2 focus-visible:outline-focus'
const labelClass = 'text-label-md font-semibold text-text-secondary'
const errorClass = 'mt-1 text-body-sm text-status-danger'

export function InvoiceCreatePage() {
  const navigate = useNavigate()
  const createInvoice = useCreateInvoice()
  const { data: clients } = useClients()
  const { data: contracts } = useContracts()
  const [clientId, setClientId] = useState('')
  const [contractId, setContractId] = useState('')
  const [clientTouched, setClientTouched] = useState(false)

  const { register, handleSubmit, formState } = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      sousTotal: '',
      tps: '',
      tvq: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    setClientTouched(true)
    if (!clientId) return

    createInvoice.mutate(
      {
        clientId,
        ...(contractId ? { contractId } : {}),
        date: values.date,
        subtotalCents: Math.round(Number(values.sousTotal) * 100),
        tpsCents: Math.round(Number(values.tps) * 100),
        tvqCents: Math.round(Number(values.tvq) * 100),
      },
      {
        onSuccess: (id) => {
          void navigate(`/invoices/${id}`)
        },
      },
    )
  })

  return (
    <div className="mx-auto max-w-[720px] space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="text-heading-xl font-bold">Créer une facture</h1>
        <p className="mt-1 text-body-sm text-text-muted">
          Le sous-total, les taxes et le total sont saisis manuellement — aucune ligne de
          produit dans le système actuel.
        </p>
      </div>

      <Card>
        <form
          onSubmit={(event) => {
            void onSubmit(event)
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="clientId" className={labelClass}>
              Client
            </label>
            <select
              id="clientId"
              value={clientId}
              onChange={(event) => {
                setClientId(event.target.value)
              }}
              className={fieldClass}
            >
              <option value="">Sélectionner un client…</option>
              {(clients ?? []).map((client) => (
                <option key={client.id} value={client.id}>
                  {client.displayName}
                </option>
              ))}
            </select>
            {clientTouched && !clientId ? (
              <p className={errorClass}>Le client est requis</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contractId" className={labelClass}>
              Contrat lié (optionnel)
            </label>
            <select
              id="contractId"
              value={contractId}
              onChange={(event) => {
                setContractId(event.target.value)
              }}
              className={fieldClass}
            >
              <option value="">—</option>
              {(contracts ?? []).map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.numero ?? contract.id}
                </option>
              ))}
            </select>
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="sousTotal" className={labelClass}>
                Sous-total ($)
              </label>
              <input
                id="sousTotal"
                inputMode="decimal"
                className={fieldClass}
                {...register('sousTotal')}
              />
              {formState.errors.sousTotal ? (
                <p className={errorClass}>{formState.errors.sousTotal.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tps" className={labelClass}>
                TPS ($)
              </label>
              <input id="tps" inputMode="decimal" className={fieldClass} {...register('tps')} />
              {formState.errors.tps ? (
                <p className={errorClass}>{formState.errors.tps.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="tvq" className={labelClass}>
                TVQ ($)
              </label>
              <input id="tvq" inputMode="decimal" className={fieldClass} {...register('tvq')} />
              {formState.errors.tvq ? (
                <p className={errorClass}>{formState.errors.tvq.message}</p>
              ) : null}
            </div>
          </div>

          {createInvoice.isError ? (
            <p role="alert" className="text-body-sm text-status-danger">
              Une erreur est survenue lors de la création de la facture. Réessayez.
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                void navigate('/invoices')
              }}
            >
              Annuler
            </Button>
            <Button type="submit" loading={createInvoice.isPending}>
              Créer la facture
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
