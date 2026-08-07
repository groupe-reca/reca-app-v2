import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/infrastructure/supabase/client'
import type { LoginInput } from '../schemas/login.schema'

// docs/05-Authentication-Roles-Permissions.md §30 — generic error
// messages only, never the raw Supabase response or account-existence
// hints.
export type LoginErrorCode = 'INVALID_CREDENTIALS'

export class LoginError extends Error {
  code: LoginErrorCode

  constructor(code: LoginErrorCode) {
    super(code)
    this.code = code
  }
}

export function useLogin() {
  return useMutation<null, LoginError, LoginInput>({
    mutationFn: async ({ email, password }) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        throw new LoginError('INVALID_CREDENTIALS')
      }
      return null
    },
  })
}
