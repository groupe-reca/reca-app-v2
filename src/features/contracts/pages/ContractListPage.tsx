import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { contractStatusMeta } from '@/domain/clientStatus'
import { formatMoneyCAD } from '@/domain/money'
import { useContracts } from '../hooks/useContracts'

export function ContractListPage() {
  const [query, setQuery] = useState('')
  const { data: allContracts, isLoading, isError } = useContracts()

  const contracts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length === 0) return allContracts ?? []
    return (allContracts ?? []).filter(
      (contract) =>
        contract.clientName.toLowerCase().includes(q) ||
        (contract.numero ?? '').toLowerCase().includes(q),
    )
  }, [allContracts, query])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-xl font-bold">Contrats</h1>
          <p className="text-body-sm text-text-muted mt-1">
            {isLoading
              ? 'Chargement…'
              : `${String(contracts.length)} contrat${contracts.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/contracts/new">
          <Button>Créer un contrat</Button>
        </Link>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
        placeholder="Rechercher par client ou numéro…"
        className="border-border-strong bg-surface text-body-md placeholder:text-text-muted focus-visible:outline-focus h-11 w-full rounded-md border px-3 focus-visible:outline-2 sm:max-w-sm"
      />

      {isError ? (
        <EmptyState
          title="Impossible de charger les contrats"
          description="Une erreur est survenue lors de la lecture des données. Réessayez plus tard."
        />
      ) : !isLoading && contracts.length === 0 ? (
        <EmptyState
          title="Aucun contrat trouvé"
          description="Essayez d’ajuster la recherche, ou créez un nouveau contrat."
        />
      ) : (
        <div className="rounded-card border-border overflow-hidden border">
          <table className="text-body-sm w-full text-left">
            <thead className="bg-surface-raised text-label-md text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Contrat</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Statut</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Type</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Prix</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {contracts.map((contract) => {
                const meta = contractStatusMeta[contract.status]
                return (
                  <tr key={contract.id} className="bg-surface hover:bg-surface-hover">
                    <td className="px-4 py-3">
                      <p className="text-text-primary font-semibold">
                        {contract.numero ?? '—'}
                      </p>
                      <p className="text-text-muted">{contract.clientName}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </td>
                    <td className="text-text-secondary hidden px-4 py-3 md:table-cell">
                      {[contract.type, contract.saison].filter(Boolean).join(' · ') ||
                        '—'}
                    </td>
                    <td className="text-text-secondary hidden px-4 py-3 tabular-nums lg:table-cell">
                      {contract.priceCents !== null
                        ? formatMoneyCAD(contract.priceCents)
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/contracts/${contract.id}`}
                        className="text-body-sm text-status-info font-medium"
                      >
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
