import type { LeadId } from '../domain/lead.types'

export const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  list: () => [...leadKeys.lists()] as const,
  details: () => [...leadKeys.all, 'detail'] as const,
  detail: (id: LeadId) => [...leadKeys.details(), id] as const,
}
