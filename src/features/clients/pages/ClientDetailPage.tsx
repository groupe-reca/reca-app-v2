import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { mockClient } from '../mocks'

function formatMoneyCAD(cents: number): string {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(
    cents / 100,
  )
}

const tabs = ['Aperçu', 'Contrats', 'Factures', 'Historique'] as const
type Tab = (typeof tabs)[number]

export function ClientDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Aperçu')
  const client = mockClient

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">
            Client · {client.type === 'COMMERCIAL' ? 'Commercial' : 'Résidentiel'}
          </p>
          <h1 className="text-heading-xl font-bold">{client.name}</h1>
          <p className="text-body-md text-text-secondary mt-1">{client.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge
            label={client.balanceCents > 0 ? 'Solde dû' : 'À jour'}
            tone={client.balanceCents > 0 ? 'warning' : 'success'}
          />
          <Button>Créer un contrat</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Contrats actifs</p>
          <p className="text-heading-lg mt-1 font-bold tabular-nums">
            {client.activeContracts}
          </p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Solde</p>
          <p className="text-heading-lg mt-1 font-bold tabular-nums">
            {formatMoneyCAD(client.balanceCents)}
          </p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Téléphone</p>
          <p className="text-body-md mt-1 font-medium">{client.phone}</p>
        </div>
        <div className="border-border bg-surface-raised rounded-lg border px-4 py-3">
          <p className="text-label-md text-text-muted">Courriel</p>
          <p className="text-body-md mt-1 truncate font-medium">{client.email}</p>
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
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {activeTab === 'Aperçu' ? (
            <Card>
              <CardHeader title="Résumé" />
              <p className="text-body-sm text-text-secondary">
                {client.name} possède {client.activeContracts} contrat(s) actif(s) pour un
                solde de {formatMoneyCAD(client.balanceCents)}.
              </p>
            </Card>
          ) : (
            <Card>
              <CardHeader title={activeTab} />
              <p className="text-body-sm text-text-muted">
                Le module {activeTab} sera implémenté avec la feature correspondante.
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Notes" />
            <p className="text-body-sm text-text-muted">Aucune note pour ce client.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
