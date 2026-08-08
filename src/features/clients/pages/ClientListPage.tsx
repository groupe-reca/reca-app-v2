import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { clientStatusMeta } from '@/domain/clientStatus'
import { useClients } from '../hooks/useClients'

export function ClientListPage() {
  const [query, setQuery] = useState('')
  const { data: allClients, isLoading, isError } = useClients()

  const clients = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length === 0) return allClients ?? []
    return (allClients ?? []).filter(
      (client) =>
        client.displayName.toLowerCase().includes(q) ||
        (client.city ?? '').toLowerCase().includes(q) ||
        (client.numero ?? '').toLowerCase().includes(q),
    )
  }, [allClients, query])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-xl font-bold">Clients</h1>
          <p className="text-body-sm text-text-muted mt-1">
            {isLoading
              ? 'Chargement…'
              : `${String(clients.length)} client${clients.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Button>Créer un client</Button>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
        placeholder="Rechercher par nom, ville ou numéro…"
        className="border-border-strong bg-surface text-body-md placeholder:text-text-muted focus-visible:outline-focus h-11 w-full rounded-md border px-3 focus-visible:outline-2 sm:max-w-sm"
      />

      {isError ? (
        <EmptyState
          title="Impossible de charger les clients"
          description="Une erreur est survenue lors de la lecture des données. Réessayez plus tard."
        />
      ) : !isLoading && clients.length === 0 ? (
        <EmptyState
          title="Aucun client trouvé"
          description="Essayez d’ajuster la recherche, ou créez un nouveau client."
        />
      ) : (
        <div className="rounded-card border-border overflow-hidden border">
          <table className="text-body-sm w-full text-left">
            <thead className="bg-surface-raised text-label-md text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Statut</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Ville</th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">
                  Téléphone
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {clients.map((client) => {
                const meta = clientStatusMeta[client.status]
                return (
                  <tr key={client.id} className="bg-surface hover:bg-surface-hover">
                    <td className="px-4 py-3">
                      <p className="text-text-primary font-semibold">
                        {client.displayName}
                      </p>
                      <p className="text-text-muted">
                        {client.numero ?? '—'} ·{' '}
                        {client.isCompany ? 'Commercial' : 'Résidentiel'}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </td>
                    <td className="text-text-secondary hidden px-4 py-3 md:table-cell">
                      {client.city ?? '—'}
                    </td>
                    <td className="text-text-secondary hidden px-4 py-3 lg:table-cell">
                      {client.phone ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/clients/${client.id}`}
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
