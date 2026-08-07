import { createBrowserRouter } from 'react-router-dom'
import { DashboardPage } from '@/features/dashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />,
    handle: {
      title: 'Centre des opérations',
      breadcrumb: 'Aujourd’hui',
      module: 'dashboard',
    },
  },
])
