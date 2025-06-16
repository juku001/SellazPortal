import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { Outlet, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { CompanyLayout } from 'src/layouts/company';
import ProtectedRoute from 'src/guards/ProtectedRoute';
import { DashboardLayout } from 'src/layouts/dashboard';

const DashboardPage = lazy(() => import('src/pages/dashboard'));
const RequestPage = lazy(() => import('src/pages/request'));
const UserPage = lazy(() => import('src/pages/user'));
const CompanysPage = lazy(() => import('src/pages/company'));
const CompanyDetailPage = lazy(() => import('src/pages/companydetail'));
const SuperDealerPage = lazy(() => import('src/pages/superdealers'));
const ProductPage = lazy(() => import('src/pages/products'));
const SignInPage = lazy(() => import('src/pages/sign-in'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <LinearProgress sx={{ width: 1, maxWidth: 320, bgcolor: theme => varAlpha(theme.vars.palette.text.primaryChannel, 0.16), [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' }, }} />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}><Outlet /></Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'company', element: <CompanysPage /> },
      { path: 'request', element: <RequestPage /> },
    ],
  },
  {
    path: '/company/:companyId',
    element: (
      <ProtectedRoute>
        <CompanyLayout>
          <Suspense fallback={renderFallback()}><Outlet /></Suspense>
        </CompanyLayout>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CompanyDetailPage /> },
      { path: 'superdealers', element: <SuperDealerPage /> },
      { path: 'bikes', element: <div>Bikes</div> },
      { path: 'products', element: <ProductPage /> },
      { path: 'reports', element: <div>Reports</div> },
      { path: 'company', element: <CompanysPage /> },
    ],
  },
  { path: '/404', element: <Page404 /> },
  { path: '*', element: <Navigate to="/404" replace /> },
];
