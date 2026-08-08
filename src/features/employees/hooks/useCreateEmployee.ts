import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { CreateEmployeeInput } from '../domain/employee.types'
import { employeeKeys } from './employeeKeys'

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => dependencies.employeeRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.list() })
    },
  })
}
