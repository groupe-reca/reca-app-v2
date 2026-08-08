import { Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/layouts/AppShell'
import { RequireAuth } from '@/features/auth'
import { NotFoundPage } from '@/features/misc/pages/NotFoundPage'
import {
  LoginPage,
  DashboardPage,
  MissionListPage,
  MissionDetailPage,
  RouteListPage,
  RouteDetailPage,
  ClientListPage,
  ClientDetailPage,
  ContractListPage,
  ContractDetailPage,
  ContractWizardPage,
  LeadListPage,
  LeadDetailPage,
  LeadCreatePage,
  QuoteListPage,
  QuoteDetailPage,
  QuoteCreatePage,
} from './lazyPages'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={null}>
        <LoginPage />
      </Suspense>
    ),
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
            path: 'leads',
            element: <LeadListPage />,
            handle: { breadcrumb: 'Leads' },
          },
          {
            path: 'leads/new',
            element: <LeadCreatePage />,
            handle: { breadcrumb: 'Nouveau lead' },
          },
          {
            path: 'leads/:leadId',
            element: <LeadDetailPage />,
            handle: { breadcrumb: 'Lead' },
          },
          {
            path: 'quotes',
            element: <QuoteListPage />,
            handle: { breadcrumb: 'Soumissions' },
          },
          {
            path: 'quotes/new',
            element: <QuoteCreatePage />,
            handle: { breadcrumb: 'Nouvelle soumission' },
          },
          {
            path: 'quotes/:quoteId',
            element: <QuoteDetailPage />,
            handle: { breadcrumb: 'Soumission' },
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
