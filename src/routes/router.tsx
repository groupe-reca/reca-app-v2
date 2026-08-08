import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/layouts/AppShell'
import { DashboardPage } from '@/features/dashboard'
import { MissionListPage, MissionDetailPage } from '@/features/missions'
import { ClientListPage, ClientDetailPage } from '@/features/clients'
import { RouteListPage, RouteDetailPage } from '@/features/routes'
import {
  ContractWizardPage,
  ContractListPage,
  ContractDetailPage,
} from '@/features/contracts'
import { LoginPage, RequireAuth } from '@/features/auth'
import { NotFoundPage } from '@/features/misc/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    handle: { breadcrumb: 'Connexion' },
  },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/operations" replace /> },
          {
            path: 'operations',
            element: <DashboardPage />,
            handle: { breadcrumb: 'Centre des opérations' },
          },
          {
            path: 'missions',
            element: <MissionListPage />,
            handle: { breadcrumb: 'Missions' },
          },
          {
            path: 'missions/:missionId',
            element: <MissionDetailPage />,
            handle: { breadcrumb: 'Mission' },
          },
          {
            path: 'routes',
            element: <RouteListPage />,
            handle: { breadcrumb: 'Routes' },
          },
          {
            path: 'routes/:routeId',
            element: <RouteDetailPage />,
            handle: { breadcrumb: 'Route' },
          },
          {
            path: 'clients',
            element: <ClientListPage />,
            handle: { breadcrumb: 'Clients' },
          },
          {
            path: 'clients/:clientId',
            element: <ClientDetailPage />,
            handle: { breadcrumb: 'Client' },
          },
          {
            path: 'contracts',
            element: <ContractListPage />,
            handle: { breadcrumb: 'Contrats' },
          },
          {
            path: 'contracts/new',
            element: <ContractWizardPage />,
            handle: { breadcrumb: 'Nouveau contrat' },
          },
          {
            path: 'contracts/:contractId',
            element: <ContractDetailPage />,
            handle: { breadcrumb: 'Contrat' },
          },
          { path: '*', element: <NotFoundPage />, handle: { breadcrumb: 'Introuvable' } },
        ],
      },
    ],
  },
])
