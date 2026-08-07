import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import { AppErrorBoundary } from './AppErrorBoundary'
import { SessionProvider } from './SessionContext'

interface Props {
  children: ReactNode
}

export function AppProviders({ children }: Props) {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>{children}</SessionProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  )
}
