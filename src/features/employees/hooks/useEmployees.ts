import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { employeeKeys } from './employeeKeys'

export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.list(),
    queryFn: () => dependencies.employeeRepository.listSummaries(),
  })
}
