import type { EmployeeId } from '../domain/employee.types'

export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: () => [...employeeKeys.lists()] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: EmployeeId) => [...employeeKeys.details(), id] as const,
}
