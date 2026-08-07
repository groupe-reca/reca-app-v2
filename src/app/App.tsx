import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './AppProviders'
import { router } from '@/routes/router'

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
