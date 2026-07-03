# PHASE 11: FRONTEND ARCHITECTURE — Hideo ERP

---

## 11.1 Technology Stack

| Tech | Version | Purpose |
|---|---|---|
| React | 19 | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 6.x | Build Tool |
| React Router | 7.x | Client-side Routing |
| TanStack Query | 5.x | Server State Management |
| Zustand | 5.x | Client State Management |
| React Hook Form | 7.x | Form Management |
| Zod | 3.x | Schema Validation |
| Tailwind CSS | 4.x | Utility-first CSS |
| shadcn/ui | latest | UI Components |
| Motion | latest | Animations |
| Lucide React | latest | Icons |
| Axios | 1.x | HTTP Client |
| Vitest | 3.x | Testing |
| React Testing Library | latest | Component Testing |

---

## 11.2 Folder Structure

```
src/
├── api/                        # API layer
│   ├── client.ts               # Axios instance + interceptors
│   ├── auth.api.ts
│   ├── users.api.ts
│   ├── roles.api.ts
│   ├── products.api.ts
│   ├── categories.api.ts
│   ├── units.api.ts
│   ├── suppliers.api.ts
│   ├── customers.api.ts
│   ├── purchases.api.ts
│   ├── sales.api.ts
│   ├── expenses.api.ts
│   ├── expense-categories.api.ts
│   ├── inventory.api.ts
│   ├── reports.api.ts
│   ├── notifications.api.ts
│   ├── logs.api.ts
│   ├── settings.api.ts
│   └── dashboard.api.ts
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── components/                 # Shared UI components
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── avatar.tsx
│   │   ├── toast.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── separator.tsx
│   │   ├── tooltip.tsx
│   │   ├── popover.tsx
│   │   ├── command.tsx
│   │   ├── tabs.tsx
│   │   ├── alert.tsx
│   │   ├── progress.tsx
│   │   └── calendar.tsx
│   │
│   ├── data-table.tsx          # Reusable data table
│   ├── search-input.tsx
│   ├── pagination.tsx
│   ├── page-header.tsx
│   ├── loading-state.tsx
│   ├── empty-state.tsx
│   ├── error-state.tsx
│   ├── confirm-dialog.tsx
│   ├── status-badge.tsx
│   ├── file-upload.tsx
│   └── stat-card.tsx
│
├── features/                   # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── pages/
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── pages/
│   │
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── pages/
│   │
│   ├── roles/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── pages/
│   │
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── pages/
│   │
│   ├── categories/
│   ├── units/
│   ├── suppliers/
│   ├── customers/
│   ├── purchases/
│   ├── sales/
│   ├── expenses/
│   ├── inventory/
│   ├── reports/
│   ├── notifications/
│   ├── logs/
│   └── settings/
│
├── hooks/                      # Shared custom hooks
│   ├── use-auth.ts
│   ├── use-debounce.ts
│   ├── use-pagination.ts
│   ├── use-table-filters.ts
│   └── use-permissions.ts
│
├── layouts/                    # Layout components
│   ├── app-layout.tsx           # Sidebar + Header + Content
│   ├── auth-layout.tsx          # Login/Register layout
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── mobile-nav.tsx
│   └── breadcrumb.tsx
│
├── pages/                      # Page-level components
│   ├── login.tsx
│   ├── forgot-password.tsx
│   ├── reset-password.tsx
│   ├── not-found.tsx
│   ├── dashboard.tsx
│   ├── users/
│   ├── roles/
│   ├── products/
│   ├── ... (sisa pages)
│
├── providers/                  # React context providers
│   ├── auth-provider.tsx
│   ├── theme-provider.tsx
│   └── query-provider.tsx
│
├── routes/                     # Route definitions
│   ├── index.tsx               # Route config
│   ├── protected-route.tsx     # Auth guard component
│   └── role-guard.tsx          # Role-based guard
│
├── services/                   # Business logic services
│   ├── auth-service.ts
│   ├── permission-service.ts
│   └── storage-service.ts
│
├── stores/                     # Zustand stores
│   ├── auth-store.ts
│   ├── theme-store.ts
│   ├── sidebar-store.ts
│   └── notification-store.ts
│
├── types/                      # Global types
│   ├── api.ts                  # API response types
│   ├── user.ts
│   ├── product.ts
│   ├── purchase.ts
│   ├── sale.ts
│   └── common.ts
│
├── utils/                      # Utility functions
│   ├── cn.ts                   # class-variance-authority + tailwind-merge
│   ├── format.ts              # Currency, date formatters
│   ├── permissions.ts         # Permission helpers
│   └── storage.ts             # Local storage wrapper
│
├── App.tsx
└── main.tsx
```

---

## 11.3 Feature Structure Pattern

Setiap fitur mengikuti struktur yang konsisten:

```
features/{feature}/
├── components/       # Feature-specific components
│   ├── {feature}-table.tsx
│   ├── {feature}-form.tsx
│   ├── {feature}-filter.tsx
│   └── {feature}-detail.tsx
│
├── hooks/            # Feature-specific hooks
│   ├── use-{feature}s.ts          # TanStack Query (list)
│   ├── use-{feature}.ts           # TanStack Query (single)
│   ├── use-create-{feature}.ts    # TanStack Query (create)
│   ├── use-update-{feature}.ts    # TanStack Query (update)
│   └── use-delete-{feature}.ts    # TanStack Query (delete)
│
├── schemas/          # Zod validation schemas
│   └── {feature}-schema.ts
│
├── types/            # Feature-specific types
│   └── index.ts
│
└── pages/            # Page components (thin)
    ├── {feature}-list-page.tsx
    ├── {feature}-create-page.tsx
    ├── {feature}-edit-page.tsx
    └── {feature}-detail-page.tsx
```

### Example: Products Feature

```
features/products/
├── components/
│   ├── product-table.tsx
│   ├── product-form.tsx
│   ├── product-filter.tsx
│   └── product-detail.tsx
│
├── hooks/
│   ├── use-products.ts
│   ├── use-product.ts
│   ├── use-create-product.ts
│   ├── use-update-product.ts
│   └── use-delete-product.ts
│
├── schemas/
│   └── product-schema.ts
│
├── types/
│   └── index.ts
│
└── pages/
    ├── products-page.tsx
    ├── product-create-page.tsx
    ├── product-edit-page.tsx
    └── product-detail-page.tsx
```

---

## 11.4 Routing Structure

### Route Configuration

```typescript
// routes/index.tsx
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  // Public routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',            element: <LoginPage /> },
      { path: '/forgot-password',  element: <ForgotPasswordPage /> },
      { path: '/reset-password/:token', element: <ResetPasswordPage /> },
    ],
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard',         element: <DashboardPage /> },
          { path: '/profile',           element: <ProfilePage /> },
          { path: '/profile/change-password', element: <ChangePasswordPage /> },

          // User Management
          { path: '/users',             element: <UsersPage /> },
          { path: '/users/create',      element: <UserCreatePage /> },
          { path: '/users/:id/edit',    element: <UserEditPage /> },
          { path: '/users/:id',         element: <UserDetailPage /> },
          { path: '/roles',             element: <RolesPage /> },
          { path: '/roles/create',      element: <RoleCreatePage /> },
          { path: '/roles/:id/edit',    element: <RoleEditPage /> },
          { path: '/permissions',       element: <PermissionsPage /> },

          // Master Data
          { path: '/products',          element: <ProductsPage /> },
          { path: '/products/create',   element: <ProductCreatePage /> },
          { path: '/products/:id/edit', element: <ProductEditPage /> },
          { path: '/products/:id',      element: <ProductDetailPage /> },
          { path: '/categories',        element: <CategoriesPage /> },
          { path: '/units',             element: <UnitsPage /> },
          { path: '/suppliers',         element: <SuppliersPage /> },
          // ... and so on
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);
```

### Route Guards

```typescript
// routes/protected-route.tsx
export function ProtectedRoute() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <LoadingScreen />;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

// routes/role-guard.tsx
export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
```

---

## 11.5 State Management Structure

### TanStack Query (Server State)

```typescript
// features/products/hooks/use-products.ts
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products.api';
import type { ProductFilters } from '../types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getAll(filters),
    placeholderData: keepPreviousData,
  });
}

// features/products/hooks/use-create-product.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/products.api';
import { productKeys } from './use-products';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
```

### Zustand (Client State)

```typescript
// stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'hideo-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

// stores/theme-store.ts
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'hideo-theme' }
  )
);

// stores/sidebar-store.ts
export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isMobileOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  closeMobile: () => set({ isMobileOpen: false }),
}));
```

---

## 11.6 API Layer Structure

```typescript
// api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiResponse } from '@/types/api';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor — attach token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// api/products.api.ts
import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Product, ProductFilters, CreateProductDto } from '@/features/products/types';

export const productsApi = {
  getAll: async (filters?: ProductFilters) => {
    const { data } = await apiClient.get<PaginatedResponse<Product>>('/products', {
      params: filters,
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return data.data;
  },

  create: async (dto: CreateProductDto) => {
    const { data } = await apiClient.post<ApiResponse<Product>>('/products', dto);
    return data.data;
  },

  update: async (id: number, dto: Partial<CreateProductDto>) => {
    const { data } = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, dto);
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
    return data;
  },
};
```

### API Types

```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
```

---

## 11.7 Form Pattern (React Hook Form + Zod)

```typescript
// features/products/schemas/product-schema.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  sku: z.string().min(1, 'SKU is required').max(50),
  category_id: z.number().int().positive().optional(),
  unit_id: z.number().int().positive('Unit is required'),
  purchase_price: z.number().min(0, 'Price must be ≥ 0'),
  selling_price: z.number().min(0, 'Price must be ≥ 0'),
  stock_minimum: z.number().int().min(0).default(10),
  description: z.string().max(1000).optional(),
}).refine(
  (data) => data.selling_price >= data.purchase_price,
  { message: 'Selling price must be ≥ purchase price', path: ['selling_price'] }
);

export type ProductFormValues = z.infer<typeof productSchema>;

// features/products/components/product-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormValues } from '../schemas/product-schema';

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  isSubmitting?: boolean;
}

export function ProductForm({ defaultValues, onSubmit, isSubmitting }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter product name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="purchase_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Price</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="selling_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling Price</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Product'}
      </Button>
    </form>
  );
}
```

---

## 11.8 Page Component Pattern

```typescript
// features/products/pages/products-page.tsx
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { useProducts } from '../hooks/use-products';
import { ProductTable } from '../components/product-table';
import { ProductFilter } from '../components/product-filter';
import type { ProductFilters } from '../types';

export function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    per_page: 15,
  });

  const { data, isLoading, isError, error, refetch } = useProducts(filters);

  if (isError) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        action={{
          label: "Add Product",
          href: "/products/create",
        }}
      />

      <ProductFilter
        filters={filters}
        onFilterChange={setFilters}
      />

      {isLoading ? (
        <LoadingState rows={5} />
      ) : !data?.data.length ? (
        <EmptyState
          title="No products found"
          description="Get started by creating your first product."
          action={{ label: "Add Product", href: "/products/create" }}
        />
      ) : (
        <ProductTable
          data={data.data}
          pagination={data.meta}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
}
```

---

## 11.9 Data Table Component

```typescript
// components/data-table.tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onSort?: (sort: { key: string; order: 'asc' | 'desc' }) => void;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  pagination,
  onPageChange,
  isLoading,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.cell({ row })}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
```

---

## 11.10 Component State Requirements

Setiap komponen/page wajib memiliki:

| State | Condition | Component |
|---|---|---|
| **Loading** | Saat data sedang di-fetch | `<Skeleton />` atau `<LoadingState />` |
| **Error** | Saat request gagal | `<ErrorState message={...} onRetry={...} />` |
| **Empty** | Saat data array kosong | `<EmptyState title={...} action={...} />` |
| **Success** | Saat data tersedia | Tampilkan data |
| **Disabled** | Form saat submitting | `isSubmitting || isPending → disabled` |

---

## 11.11 Query Key Convention

```
['resource']              → all
['resource', 'list']      → all lists
['resource', 'list', filters] → specific list
['resource', 'detail']    → all details
['resource', 'detail', id] → specific detail
```

Contoh:
```typescript
productsKeys.all = ['products']
productsKeys.lists() = ['products', 'list']
productsKeys.list(filters) = ['products', 'list', { page: 1, ... }]
productsKeys.details() = ['products', 'detail']
productsKeys.detail(id) = ['products', 'detail', 1]
```

---

--- _End of Phase 11 — Frontend Architecture_ ---
