import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/infrastructure/supabase/client'

// docs/05-Authentication-Roles-Permissions.md §40 — sign out must clear
// the local session, sensitive caches, and any Realtime subscriptions.
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
