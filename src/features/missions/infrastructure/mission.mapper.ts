import { mapLegacyMissionStatus } from '@/domain/missionStatus'
import type { Database } from '@/infrastructure/supabase/database.types'
import type {
  MissionDetail,
  MissionItemDetail,
  MissionSummary,
} from '../domain/mission.types'

type MissionRow = Database['public']['Tables']['missions']['Row']
type MissionItemRow = Database['public']['Tables']['mission_items']['Row']
type RouteRow = Database['public']['Tables']['routes']['Row']
type EmployeeRow = Database['public']['Tables']['employees']['Row']
type EquipmentRow = Database['public']['Tables']['equipments']['Row']
type ContractRow = Database['public']['Tables']['contracts']['Row']
type ClientRow = Database['public']['Tables']['clients']['Row']

function formatEmployeeName(
  employee: Pick<EmployeeRow, 'prenom' | 'nom'> | undefined,
): string | null {
  if (!employee) return null
  return `${employee.prenom} ${employee.nom}`
}

function formatClientLabel(
  client: Pick<ClientRow, 'prenom' | 'nom' | 'entreprise'> | undefined,
): string {
  if (!client) return 'Client inconnu'
  if (client.entreprise) return client.entreprise
  const fullName = `${client.prenom ?? ''} ${client.nom ?? ''}`.trim()
  return fullName.length > 0 ? fullName : 'Client inconnu'
}

interface MissionLookups {
  routesById: Map<string, RouteRow>
  employeesById: Map<string, EmployeeRow>
  equipmentsById: Map<string, EquipmentRow>
  itemsByMissionId: Map<string, MissionItemRow[]>
}

export function mapMissionRowToSummary(
  row: MissionRow,
  lookups: MissionLookups,
): MissionSummary {
  const route = lookups.routesById.get(row.route_id)
  const operator = row.operator_id
    ? lookups.employeesById.get(row.operator_id)
    : undefined
  const equipment = row.equipment_id
    ? lookups.equipmentsById.get(row.equipment_id)
    : undefined
  const items = lookups.itemsByMissionId.get(row.id) ?? []

  return {
    id: row.id,
    numero: row.numero,
    date: row.date,
    status: mapLegacyMissionStatus(row.statut),
    routeName: route?.nom ?? 'Route inconnue',
    operatorName: formatEmployeeName(operator),
    equipmentName: equipment?.nom ?? null,
    itemsDone: items.filter((item) => item.statut === 'terminee').length,
    itemsTotal: items.length,
    hasProblem: items.some(
      (item) => item.statut === 'impossible' || item.statut === 'a_reprendre',
    ),
  }
}

export function mapMissionRowToDetail(
  row: MissionRow,
  lookups: MissionLookups & {
    contractsById: Map<string, ContractRow>
    clientsById: Map<string, ClientRow>
  },
): MissionDetail {
  const summary = mapMissionRowToSummary(row, lookups)
  const items = lookups.itemsByMissionId.get(row.id) ?? []

  const itemDetails: MissionItemDetail[] = items.map((item) => {
    const contract = lookups.contractsById.get(item.contract_id)
    const client = contract ? lookups.clientsById.get(contract.client_id) : undefined
    return {
      id: item.id,
      status: item.statut,
      contractNumero: contract?.numero ?? null,
      clientLabel: formatClientLabel(client),
    }
  })

  return {
    ...summary,
    notes: row.notes,
    items: itemDetails,
  }
}
