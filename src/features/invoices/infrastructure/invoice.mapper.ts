import type { Database } from '@/infrastructure/supabase/database.types'
import type { InvoiceSummary } from '../domain/invoice.types'

type InvoiceRow = Database['public']['Tables']['invoices']['Row']
type ClientRow = Database['public']['Tables']['clients']['Row']
type ContractRow = Database['public']['Tables']['contracts']['Row']

function clientDisplayName(
  row: Pick<ClientRow, 'prenom' | 'nom' | 'entreprise'> | undefined,
): string | null {
  if (!row) return null
  if (row.entreprise) return row.entreprise
  const fullName = `${row.prenom ?? ''} ${row.nom ?? ''}`.trim()
  return fullName.length > 0 ? fullName : null
}

export function mapInvoiceRowToSummary(
  row: InvoiceRow,
  client: ClientRow | undefined,
  contract: ContractRow | undefined,
): InvoiceSummary {
  return {
    id: row.id,
    numero: row.numero,
    status: row.statut,
    date: row.date,
    subtotalCents: Math.round(row.sous_total * 100),
    tpsCents: Math.round(row.tps * 100),
    tvqCents: Math.round(row.tvq * 100),
    totalCents: Math.round(row.total * 100),
    balanceCents: Math.round(row.solde * 100),
    clientId: row.client_id,
    clientDisplayName: clientDisplayName(client),
    contractId: row.contrat_id,
    contractNumero: contract?.numero ?? null,
  }
}
