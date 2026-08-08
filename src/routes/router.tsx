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
  EmployeeListPage,
  EmployeeDetailPage,
  EmployeeCreatePage,
  EquipmentListPage,
  EquipmentDetailPage,
  EquipmentCreatePage,
  InvoiceListPage,
  InvoiceDetailPage,
  InvoiceCreatePage,
  PaymentListPage,
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
            path: 'invoices',
            element: <InvoiceListPage />,
            handle: { breadcrumb: 'Factures' },
          },
          {
            path: 'invoices/new',
            element: <InvoiceCreatePage />,
            handle: { breadcrumb: 'Nouvelle facture' },
          },
          {
            path: 'invoices/:invoiceId',
            element: <InvoiceDetailPage />,
            handle: { breadcrumb: 'Facture' },
          },
          {
            path: 'payments',
            element: <PaymentListPage />,
            handle: { breadcrumb: 'Paiements' },
          },
          {
            path: 'employees',
            element: <EmployeeListPage />,
            handle: { breadcrumb: 'Employés' },
          },
          {
            path: 'employees/new',
            element: <EmployeeCreatePage />,
            handle: { breadcrumb: 'Nouvel employé' },
          },
          {
            path: 'employees/:employeeId',
            element: <EmployeeDetailPage />,
            handle: { breadcrumb: 'Employé' },
          },
          {
            path: 'equipments',
            element: <EquipmentListPage />,
            handle: { breadcrumb: 'Équipements' },
          },
          {
            path: 'equipments/new',
            element: <EquipmentCreatePage />,
            handle: { breadcrumb: 'Nouvel équipement' },
          },
          {
            path: 'equipments/:equipmentId',
            element: <EquipmentDetailPage />,
            handle: { breadcrumb: 'Équipement' },
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
