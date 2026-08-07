import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/infrastructure/supabase/client'
import type { AppSession } from '@/domain/session'

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface SessionContextValue {
  status: SessionStatus
  session: AppSession | null
}

const SessionContext = createContext<SessionContextValue | null>(null)

// `undefined` = not yet resolved by Supabase; `null` = resolved, signed out.
function useAuthUserId(): string | null | undefined {
  const [authUserId, setAuthUserId] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setAuthUserId(data.session?.user.id ?? null)
      })
      .catch(() => {
        setAuthUserId(null)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, authSession) => {
      setAuthUserId(authSession?.user.id ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return authUserId
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const authUserId = useAuthUserId()

  const profileQuery = useQuery({
    queryKey: ['auth', 'profile', authUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId ?? '')
        .is('deleted_at', null)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: authUserId !== undefined && authUserId !== null,
  })

  let value: SessionContextValue
  if (authUserId === undefined) {
    value = { status: 'loading', session: null }
  } else if (authUserId === null) {
    value = { status: 'unauthenticated', session: null }
  } else if (profileQuery.isPending) {
    value = { status: 'loading', session: null }
  } else if (!profileQuery.data) {
    // Auth session exists but no matching public.users row (or it's
    // soft-deleted) — treat as unauthenticated rather than crash.
    value = { status: 'unauthenticated', session: null }
  } else {
    const row = profileQuery.data
    value = {
      status: 'authenticated',
      session: {
        userId: row.id,
        email: row.email,
        role: row.role,
        actif: row.actif,
        displayName: row.nom,
        theme: row.theme,
      },
    }
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
