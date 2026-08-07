import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import { AppErrorBoundary } from './AppErrorBoundary'

interface Props {
  children: ReactNode
}

export function AppProviders({ children }: Props) {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppErrorBoundary>
  )
}
