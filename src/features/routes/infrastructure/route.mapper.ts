import type { Database } from '@/infrastructure/supabase/database.types'
import type {
  RouteContractDetail,
  RouteDetail,
  RouteSummary,
} from '../domain/route.types'

type RouteRow = Database['public']['Tables']['routes']['Row']
type RouteContractRow = Database['public']['Tables']['route_contracts']['Row']
type EmployeeRow = Database['public']['Tables']['employees']['Row']
type EquipmentRow = Database['public']['Tables']['equipments']['Row']
type ContractRow = Database['public']['Tables']['contracts']['Row']

interface RouteLookups {
  employeesById: Map<string, EmployeeRow>
  equipmentsById: Map<string, EquipmentRow>
  contractCountByRouteId: Map<string, number>
}

export function mapRouteRowToSummary(row: RouteRow, lookups: RouteLookups): RouteSummary {
  const operator = row.operator_id
    ? lookups.employeesById.get(row.operator_id)
    : undefined
  const equipment = row.equipment_id
    ? lookups.equipmentsById.get(row.equipment_id)
    : undefined

  return {
    id: row.id,
    nom: row.nom,
    couleur: row.couleur,
    operatorName: operator ? `${operator.prenom} ${operator.nom}` : null,
    equipmentName: equipment?.nom ?? null,
    contractCount: lookups.contractCountByRouteId.get(row.id) ?? 0,
  }
}

export function mapRouteRowToDetail(
  row: RouteRow,
  lookups: RouteLookups,
  routeContracts: RouteContractRow[],
  contractsById: Map<string, ContractRow>,
): RouteDetail {
  const contracts: RouteContractDetail[] = routeContracts
    .slice()
    .sort((a, b) => a.ordre - b.ordre)
    .map((rc) => {
      const contract = contractsById.get(rc.contract_id)
      return {
        id: rc.id,
        ordre: rc.ordre,
        contractId: rc.contract_id,
        contractNumero: contract?.numero ?? null,
        address: contract?.adresse_geocodee ?? null,
        status: contract?.statut ?? 'en_attente',
      }
    })

  return {
    ...mapRouteRowToSummary(row, {
      ...lookups,
      contractCountByRouteId: new Map([[row.id, contracts.length]]),
    }),
    contracts,
  }
}
