import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useRoutes } from '../hooks/useRoutes'

export function RouteListPage() {
  const [query, setQuery] = useState('')
  const { data: allRoutes, isLoading, isError } = useRoutes()

  const routes = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length === 0) return allRoutes ?? []
    return (allRoutes ?? []).filter((route) => route.nom.toLowerCase().includes(q))
  }, [allRoutes, query])

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-xl font-bold">Routes</h1>
          <p className="text-body-sm text-text-muted mt-1">
            {isLoading
              ? 'Chargement…'
              : `${String(routes.length)} route${routes.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <Button>Créer une route</Button>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
        placeholder="Rechercher par nom…"
        className="border-border-strong bg-surface text-body-md placeholder:text-text-muted focus-visible:outline-focus h-11 w-full rounded-md border px-3 focus-visible:outline-2 sm:max-w-sm"
      />

      {isError ? (
        <EmptyState
          title="Impossible de charger les routes"
          description="Une erreur est survenue lors de la lecture des données. Réessayez plus tard."
        />
      ) : !isLoading && routes.length === 0 ? (
        <EmptyState
          title="Aucune route trouvée"
          description="Essayez d’ajuster la recherche, ou créez une nouvelle route."
        />
      ) : (
        <div className="rounded-card border-border overflow-hidden border">
          <table className="text-body-sm w-full text-left">
            <thead className="bg-surface-raised text-label-md text-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Route</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                  Opérateur
                </th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">
                  Équipement
                </th>
                <th className="hidden px-4 py-3 font-semibold lg:table-cell">Contrats</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {routes.map((route) => (
                <tr key={route.id} className="bg-surface hover:bg-surface-hover">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: route.couleur }}
                        aria-hidden="true"
                      />
                      <p className="text-text-primary font-semibold">{route.nom}</p>
                    </div>
                  </td>
                  <td className="text-text-secondary hidden px-4 py-3 sm:table-cell">
                    {route.operatorName ?? 'Non assigné'}
                  </td>
                  <td className="text-text-secondary hidden px-4 py-3 md:table-cell">
                    {route.equipmentName ?? 'Non assigné'}
                  </td>
                  <td className="text-text-secondary hidden px-4 py-3 tabular-nums lg:table-cell">
                    {route.contractCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/routes/${route.id}`}
                      className="text-body-sm text-status-info font-medium"
                    >
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
