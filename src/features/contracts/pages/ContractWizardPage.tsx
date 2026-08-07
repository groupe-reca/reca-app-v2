import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import {
  contractClientStepSchema,
  contractServiceStepSchema,
  type ContractClientStep,
  type ContractServiceStep,
} from '../schemas'

const steps = ['Client', 'Service', 'Confirmation'] as const
type StepName = (typeof steps)[number]

function formatMoneyCAD(cents: number): string {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(
    cents / 100,
  )
}

export function ContractWizardPage() {
  const [stepIndex, setStepIndex] = useState(0)
  const [clientData, setClientData] = useState<ContractClientStep | null>(null)
  const [serviceData, setServiceData] = useState<ContractServiceStep | null>(null)
  const currentStep: StepName = steps[stepIndex] ?? 'Client'

  const clientForm = useForm<ContractClientStep>({
    resolver: zodResolver(contractClientStepSchema),
    defaultValues: {
      clientName: clientData?.clientName ?? '',
      clientType: clientData?.clientType ?? 'RESIDENTIEL',
    },
  })

  const serviceForm = useForm<ContractServiceStep>({
    resolver: zodResolver(contractServiceStepSchema),
    defaultValues: {
      serviceLabel: serviceData?.serviceLabel ?? '',
      priceCents: serviceData?.priceCents ?? 0,
    },
  })

  return (
    <div className="mx-auto max-w-[1100px] p-4 pb-28 lg:p-8">
      <h1 className="text-heading-xl font-bold">Nouveau contrat</h1>
      <p className="text-body-sm text-text-muted mt-1">
        Formulaire complexe — étapes avec validation, per docs/00-Vision.md §34.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <ol className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {steps.map((step, index) => (
            <li key={step}>
              <button
                type="button"
                onClick={() => {
                  setStepIndex(index)
                }}
                className={cn(
                  'text-body-sm w-full rounded-md px-3 py-2 text-left font-medium whitespace-nowrap transition-colors',
                  index === stepIndex
                    ? 'bg-brand-red/10 text-brand-red'
                    : 'text-text-secondary hover:bg-surface-hover',
                )}
              >
                {index + 1}. {step}
              </button>
            </li>
          ))}
        </ol>

        <Card>
          {currentStep === 'Client' ? (
            <form
              onSubmit={(event) => {
                void clientForm.handleSubmit((values) => {
                  setClientData(values)
                  setStepIndex(1)
                })(event)
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="clientName"
                  className="text-label-md text-text-secondary font-semibold"
                >
                  Nom du client
                </label>
                <input
                  id="clientName"
                  className="border-border-strong bg-surface text-body-md focus-visible:outline-focus mt-1 h-11 w-full rounded-md border px-3 focus-visible:outline-2"
                  {...clientForm.register('clientName')}
                />
                {clientForm.formState.errors.clientName ? (
                  <p className="text-body-sm text-status-danger mt-1">
                    {clientForm.formState.errors.clientName.message}
                  </p>
                ) : null}
              </div>

              <div>
                <span className="text-label-md text-text-secondary font-semibold">
                  Type de client
                </span>
                <div className="mt-2 flex gap-4">
                  <label className="text-body-sm flex items-center gap-2">
                    <input
                      type="radio"
                      value="RESIDENTIEL"
                      {...clientForm.register('clientType')}
                    />
                    Résidentiel
                  </label>
                  <label className="text-body-sm flex items-center gap-2">
                    <input
                      type="radio"
                      value="COMMERCIAL"
                      {...clientForm.register('clientType')}
                    />
                    Commercial
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit">Continuer</Button>
              </div>
            </form>
          ) : null}

          {currentStep === 'Service' ? (
            <form
              onSubmit={(event) => {
                void serviceForm.handleSubmit((values) => {
                  setServiceData(values)
                  setStepIndex(2)
                })(event)
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="serviceLabel"
                  className="text-label-md text-text-secondary font-semibold"
                >
                  Service offert
                </label>
                <input
                  id="serviceLabel"
                  placeholder="Ex. Déneigement résidentiel — saison complète"
                  className="border-border-strong bg-surface text-body-md focus-visible:outline-focus mt-1 h-11 w-full rounded-md border px-3 focus-visible:outline-2"
                  {...serviceForm.register('serviceLabel')}
                />
                {serviceForm.formState.errors.serviceLabel ? (
                  <p className="text-body-sm text-status-danger mt-1">
                    {serviceForm.formState.errors.serviceLabel.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="priceCents"
                  className="text-label-md text-text-secondary font-semibold"
                >
                  Prix (en cents)
                </label>
                <input
                  id="priceCents"
                  type="number"
                  className="border-border-strong bg-surface text-body-md focus-visible:outline-focus mt-1 h-11 w-full rounded-md border px-3 focus-visible:outline-2"
                  {...serviceForm.register('priceCents', { valueAsNumber: true })}
                />
                {serviceForm.formState.errors.priceCents ? (
                  <p className="text-body-sm text-status-danger mt-1">
                    {serviceForm.formState.errors.priceCents.message}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setStepIndex(0)
                  }}
                >
                  Retour
                </Button>
                <Button type="submit">Continuer</Button>
              </div>
            </form>
          ) : null}

          {currentStep === 'Confirmation' ? (
            <div className="space-y-4">
              <dl className="text-body-sm space-y-3">
                <div>
                  <dt className="text-text-muted">Client</dt>
                  <dd className="text-text-primary font-medium">
                    {clientData?.clientName} (
                    {clientData?.clientType === 'COMMERCIAL'
                      ? 'Commercial'
                      : 'Résidentiel'}
                    )
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">Service</dt>
                  <dd className="text-text-primary font-medium">
                    {serviceData?.serviceLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-text-muted">Prix</dt>
                  <dd className="text-text-primary font-medium">
                    {serviceData ? formatMoneyCAD(serviceData.priceCents) : '—'}
                  </dd>
                </div>
              </dl>
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setStepIndex(1)
                  }}
                >
                  Retour
                </Button>
                <Button type="button">Créer le contrat</Button>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
