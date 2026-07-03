import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { DashboardPage } from '@/pages/dashboard'
import { ForgotPasswordPage } from '@/pages/forgot-password'
import { LoginPage } from '@/pages/login'
import { ResetPasswordPage } from '@/pages/reset-password'
import { ProductsPage } from '@/pages/products'
import { SalesPage } from '@/pages/sales'
import { PurchasesPage } from '@/pages/purchases'
import { CustomersPage } from '@/pages/customers'
import { ReportsPage } from '@/pages/reports'
import { SettingsPage } from '@/pages/settings'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { useEffect } from 'react'
import { ToastContainer } from '@/lib/toaster'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

function AppRoutes() {
  const fetchUser = useAuthStore((s) => s.fetchUser)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ToastContainer />
    </QueryClientProvider>
  )
}
