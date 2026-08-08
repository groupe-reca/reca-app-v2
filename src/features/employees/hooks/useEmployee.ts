import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { EmployeeId } from '../domain/employee.types'
import { employeeKeys } from './employeeKeys'

export function useEmployee(id: EmployeeId | undefined) {
  return useQuery({
    queryKey: employeeKeys.detail(id ?? ''),
    queryFn: () => dependencies.employeeRepository.getById(id ?? ''),
    enabled: Boolean(id),
  })
}
