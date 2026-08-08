import type {
  CreateEmployeeInput,
  EmployeeDetail,
  EmployeeId,
  EmployeeSummary,
  UpdateEmployeeInput,
} from './employee.types'

export interface EmployeeRepository {
  listSummaries(): Promise<EmployeeSummary[]>
  getById(id: EmployeeId): Promise<EmployeeDetail | null>
  create(input: CreateEmployeeInput): Promise<EmployeeId>
  update(id: EmployeeId, input: UpdateEmployeeInput): Promise<void>
  setActive(id: EmployeeId, active: boolean): Promise<void>
}
