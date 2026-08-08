import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { EmployeeId } from '../domain/employee.types'
import { employeeKeys } from './employeeKeys'

export function useSetEmployeeActive(id: EmployeeId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (active: boolean) => dependencies.employeeRepository.setActive(id, active),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: employeeKeys.list() })
    },
  })
}
