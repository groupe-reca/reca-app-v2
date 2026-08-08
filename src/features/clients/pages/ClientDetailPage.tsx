import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { clientStatusMeta, contractStatusMeta } from '@/domain/clientStatus'
import { formatMoneyCAD } from '@/domain/money'
import { useClient } from '../hooks/useClient'

const tabs = ['Aperçu', 'Contrats'] as const
type Tab = (typeof tabs)[number]

export function ClientDetailPage() {
  const { clientId } = useParams()
  const { data: client, isLoading, isError } = useClient(clientId)
  const [activeTab, setActiveTab] = useState<Tab>('Aperçu')

  if (isLoading) {
    return <div className="text-body-sm text-text-muted p-8">Chargement…</div>
  }

  if (isError || !client) {
    return (
      <div className="p-8">
        <EmptyState
          title="Client introuvable"
          description="Vérifiez le lien, ou l’authentification requise pour lire cette donnée n’est pas encore en place."
        />
      </div>
    )
  }

  const meta = clientStatusMeta[client.status]
  const activeContracts = client.contracts.filter((c) => c.status === 'actif')
  const contractsTotalCents = client.contracts.reduce(
    (sum, c) => sum + (c.priceCents ?? 0),
    0,
  )

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">
            Client · {client.isCompany ? 'Commercial' : 'Résidentiel'}
          </p>
          <h1 className="text-heading-xl font-bold">{client.displayName}</h1>
          <p className="text-body-md text-text-secondary mt-1">
            {client.address ?? 'Adresse non renseignée'}
            {client.city ? `, ${client.city}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge label={meta.label} tone={meta.tone} />
          <Button>Créer un contrat</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Contrats actifs</p>
          <p className="text-heading-lg mt-1 font-bold tabular-nums">
            {activeContracts.length}
          </p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Valeur des contrats</p>
          <p className="text-heading-lg mt-1 font-bold tabular-nums">
            {formatMoneyCAD(contractsTotalCents)}
          </p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Téléphone</p>
          <p className="text-body-md mt-1 font-medium">{client.phone ?? '—'}</p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Courriel</p>
          <p className="text-body-md mt-1 truncate font-medium">{client.email ?? '—'}</p>
        </div>
      </div>

      <div className="border-border flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab)
            }}
            className={`text-body-sm px-3 py-2.5 font-medium transition-colors ${
              activeTab === tab
                ? 'border-brand-red text-text-primary border-b-2'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab}
            {tab === 'Contrats' ? ` (${String(client.contracts.length)})` : ''}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {activeTab === 'Aperçu' ? (
            <Card>
              <CardHeader title="Résumé" />
              <p className="text-body-sm text-text-secondary">
                {client.displayName} possède {activeContracts.length} contrat(s) actif(s)
                sur {client.contracts.length} au total, pour une valeur de{' '}
                {formatMoneyCAD(contractsTotalCents)}.
              </p>
            </Card>
          ) : (
            <Card>
              <CardHeader
                title="Contrats"
                meta={`${String(client.contracts.length)} au total`}
              />
              {client.contracts.length === 0 ? (
                <p className="text-body-sm text-text-muted">
                  Aucun contrat pour ce client.
                </p>
              ) : (
                <ul className="divide-border divide-y">
                  {client.contracts.map((contract) => {
                    const contractMeta = contractStatusMeta[contract.status]
                    return (
                      <li
                        key={contract.id}
                        className="flex items-center justify-between gap-3 py-2.5"
                      >
                        <div>
                          <p className="text-body-sm text-text-primary font-semibold">
                            {contract.numero ?? '—'}
                          </p>
                          <p className="text-body-sm text-text-muted">
                            {[contract.type, contract.saison]
                              .filter(Boolean)
                              .join(' · ') || '—'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {contract.priceCents !== null ? (
                            <span className="text-body-sm text-text-secondary tabular-nums">
                              {formatMoneyCAD(contract.priceCents)}
                            </span>
                          ) : null}
                          <StatusBadge
                            label={contractMeta.label}
                            tone={contractMeta.tone}
                          />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Notes" />
            <p className="text-body-sm text-text-muted">
              {client.notes ?? 'Aucune note pour ce client.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
