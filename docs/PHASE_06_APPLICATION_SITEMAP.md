# PHASE 6: APPLICATION SITEMAP — Hideo ERP

---

## 6.1 Navigation Structure

```
HIDEO ERP
│
├── 🔐 AUTH (Public Routes — No Auth Required)
│   ├── /login
│   ├── /forgot-password
│   └── /reset-password/:token
│
├── 📊 DASHBOARD
│   └── /dashboard
│
├── 👥 USER MANAGEMENT (Super Admin + Owner + Manager)
│   ├── /users
│   │   ├── /users (list)
│   │   ├── /users/create
│   │   ├── /users/:id/edit
│   │   └── /users/:id
│   ├── /roles
│   │   ├── /roles (list)
│   │   ├── /roles/create
│   │   └── /roles/:id/edit
│   └── /permissions
│
├── 📦 MASTER DATA
│   ├── /products
│   │   ├── /products (list)
│   │   ├── /products/create
│   │   ├── /products/:id/edit
│   │   └── /products/:id
│   ├── /categories (produk)
│   ├── /units (satuan)
│   ├── /suppliers
│   │   ├── /suppliers (list)
│   │   ├── /suppliers/create
│   │   ├── /suppliers/:id/edit
│   │   └── /suppliers/:id
│   └── /customers
│       ├── /customers (list)
│       ├── /customers/create
│       ├── /customers/:id/edit
│       └── /customers/:id
│
├── 📋 TRANSACTIONS
│   ├── /purchases
│   │   ├── /purchases (list)
│   │   ├── /purchases/create
│   │   ├── /purchases/:id
│   │   └── /purchases/:id/edit
│   ├── /sales
│   │   ├── /sales (list)
│   │   ├── /sales/create
│   │   ├── /sales/:id
│   │   └── /sales/:id/edit
│   └── /expenses
│       ├── /expenses (list)
│       ├── /expenses/create
│       ├── /expenses/:id/edit
│       └── /expense-categories
│
├── 📦 INVENTORY
│   ├── /inventory (stock list)
│   ├── /inventory/stock-in
│   ├── /inventory/stock-out
│   ├── /inventory/adjustment
│   └── /inventory/history
│
├── 📄 REPORTS (Super Admin + Owner + Manager)
│   ├── /reports/sales
│   ├── /reports/purchases
│   ├── /reports/inventory
│   └── /reports/expenses
│
├── 🔔 NOTIFICATIONS
│   └── /notifications
│
├── 📋 ACTIVITY LOGS (Super Admin + Owner + Manager)
│   ├── /logs/activities
│   └── /logs/logins
│
├── ⚙️ SETTINGS
│   ├── /settings/company
│   └── /settings/application (Super Admin only)
│
└── 👤 PROFILE
    ├── /profile
    └── /profile/change-password
```

---

## 6.2 Sidebar Navigation (Desktop)

### Menu by Role

#### Super Admin Sidebar
```
┌──────────────────────────────┐
│         HIDEO ERP            │  ← Logo + App Name
├──────────────────────────────┤
│  📊 Dashboard                │
│  👥 User Management          │  ← Expandable
│     ├── Users                │
│     ├── Roles                │
│     └── Permissions          │
│  📦 Master Data              │  ← Expandable
│     ├── Products             │
│     ├── Categories           │
│     ├── Units                │
│     ├── Suppliers            │
│     └── Customers            │
│  📋 Transactions             │  ← Expandable
│     ├── Purchases            │
│     ├── Sales                │
│     └── Expenses             │
│  📦 Inventory                │  ← Expandable
│     ├── Stock List           │
│     ├── Stock In             │
│     ├── Stock Out            │
│     ├── Adjustment           │
│     └── Stock History        │
│  📄 Reports                  │  ← Expandable
│     ├── Sales Report         │
│     ├── Purchase Report      │
│     ├── Inventory Report     │
│     └── Expense Report       │
│  🔔 Notifications            │
│  📋 Activity Logs            │  ← Expandable
│     ├── Activity Logs        │
│     └── Login Logs           │
│  ⚙️ Settings                  │  ← Expandable
│     ├── Company Profile      │
│     └── Application          │
└──────────────────────────────┘
```

#### Owner Sidebar
```
┌──────────────────────────────┐
│         HIDEO ERP            │
├──────────────────────────────┤
│  📊 Dashboard                │
│  👥 Users (View Only)        │
│  📦 Master Data              │
│     ├── Products             │
│     ├── Categories           │
│     ├── Units                │
│     ├── Suppliers            │
│     └── Customers            │
│  📋 Transactions             │
│     ├── Purchases            │
│     ├── Sales                │
│     └── Expenses             │
│  📦 Inventory                │
│  📄 Reports                  │
│  🔔 Notifications            │
│  📋 Activity Logs            │
│  ⚙️ Company Profile          │
└──────────────────────────────┘
```

#### Manager Sidebar
```
┌──────────────────────────────┐
│         HIDEO ERP            │
├──────────────────────────────┤
│  📊 Dashboard                │
│  📦 Master Data              │
│     ├── Products             │
│     ├── Categories           │
│     ├── Units                │
│     ├── Suppliers            │
│     └── Customers            │
│  📋 Transactions             │
│     ├── Purchases            │
│     ├── Sales                │
│     └── Expenses             │
│  📦 Inventory                │
│  📄 Reports                  │
│  🔔 Notifications            │
└──────────────────────────────┘
```

#### Staff Sidebar
```
┌──────────────────────────────┐
│         HIDEO ERP            │
├──────────────────────────────┤
│  📊 Dashboard                │
│  📦 Master Data              │
│     ├── Products (View)      │
│     ├── Suppliers (View)     │
│     └── Customers (View)     │
│  📋 Transactions             │
│     ├── Purchases            │
│     ├── Sales                │
│     └── Expenses             │
│  📦 Inventory                │
│     ├── Stock List           │
│     ├── Stock In             │
│     └── Stock Out            │
│  🔔 Notifications            │
└──────────────────────────────┘
```

---

## 6.3 Mobile Bottom Navigation

Pada layar mobile (< 768px), sidebar diganti dengan bottom navigation bar:

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│                    (Content Area)                      │
│                                                       │
│                                                       │
│                                                       │
├──────────────────────────────────────────────────────┤
│  📊    📦    📋    📄    ⚙️                          │
│ Home  Stock  Trans  Report  More                     │
└──────────────────────────────────────────────────────┘
```

- **Home**: Dashboard
- **Stock**: Inventory quick access (Stock In/Out/List)
- **Trans**: Transactions (Sales, Purchases, Expenses)
- **Report**: Reports overview
- **More**: Hamburger menu → full navigation drawer

---

## 6.4 Route Structure (Frontend React Router)

```typescript
// routes/index.tsx

const routes = [
  // Public Routes
  { path: '/login',              element: <LoginPage /> },
  { path: '/forgot-password',    element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },

  // Protected Routes (Layout: AppLayout = Sidebar + Header + Content)
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard',               element: <DashboardPage /> },
      { path: '/profile',                 element: <ProfilePage /> },
      { path: '/profile/change-password', element: <ChangePasswordPage /> },

      // User Management
      { path: '/users',                   element: <UsersPage /> },
      { path: '/users/create',            element: <UserCreatePage /> },
      { path: '/users/:id/edit',          element: <UserEditPage /> },
      { path: '/users/:id',               element: <UserDetailPage /> },
      { path: '/roles',                   element: <RolesPage /> },
      { path: '/roles/create',            element: <RoleCreatePage /> },
      { path: '/roles/:id/edit',          element: <RoleEditPage /> },
      { path: '/permissions',             element: <PermissionsPage /> },

      // Master Data
      { path: '/products',                element: <ProductsPage /> },
      { path: '/products/create',         element: <ProductCreatePage /> },
      { path: '/products/:id/edit',       element: <ProductEditPage /> },
      { path: '/products/:id',            element: <ProductDetailPage /> },
      { path: '/categories',              element: <CategoriesPage /> },
      { path: '/units',                   element: <UnitsPage /> },
      { path: '/suppliers',               element: <SuppliersPage /> },
      { path: '/suppliers/create',        element: <SupplierCreatePage /> },
      { path: '/suppliers/:id/edit',      element: <SupplierEditPage /> },
      { path: '/suppliers/:id',           element: <SupplierDetailPage /> },
      { path: '/customers',               element: <CustomersPage /> },
      { path: '/customers/create',        element: <CustomerCreatePage /> },
      { path: '/customers/:id/edit',      element: <CustomerEditPage /> },
      { path: '/customers/:id',           element: <CustomerDetailPage /> },

      // Transactions
      { path: '/purchases',               element: <PurchasesPage /> },
      { path: '/purchases/create',        element: <PurchaseCreatePage /> },
      { path: '/purchases/:id',           element: <PurchaseDetailPage /> },
      { path: '/purchases/:id/edit',      element: <PurchaseEditPage /> },
      { path: '/sales',                   element: <SalesPage /> },
      { path: '/sales/create',            element: <SaleCreatePage /> },
      { path: '/sales/:id',               element: <SaleDetailPage /> },
      { path: '/sales/:id/edit',          element: <SaleEditPage /> },
      { path: '/expenses',                element: <ExpensesPage /> },
      { path: '/expenses/create',         element: <ExpenseCreatePage /> },
      { path: '/expenses/:id/edit',       element: <ExpenseEditPage /> },
      { path: '/expense-categories',      element: <ExpenseCategoriesPage /> },

      // Inventory
      { path: '/inventory',               element: <InventoryPage /> },
      { path: '/inventory/stock-in',      element: <StockInPage /> },
      { path: '/inventory/stock-out',     element: <StockOutPage /> },
      { path: '/inventory/adjustment',    element: <StockAdjustmentPage /> },
      { path: '/inventory/history',       element: <StockHistoryPage /> },

      // Reports
      { path: '/reports/sales',           element: <SalesReportPage /> },
      { path: '/reports/purchases',       element: <PurchaseReportPage /> },
      { path: '/reports/inventory',       element: <InventoryReportPage /> },
      { path: '/reports/expenses',        element: <ExpenseReportPage /> },

      // Notifications
      { path: '/notifications',           element: <NotificationsPage /> },

      // Activity Logs
      { path: '/logs/activities',         element: <ActivityLogsPage /> },
      { path: '/logs/logins',             element: <LoginLogsPage /> },

      // Settings
      { path: '/settings/company',        element: <CompanySettingsPage /> },
      { path: '/settings/application',    element: <AppSettingsPage /> },
    ],
  },

  // 404
  { path: '*', element: <NotFoundPage /> },
];
```

---

## 6.5 Page-to-Module Mapping

| No | Page | Module | UC Reference |
|---|---|---|---|
| 1 | LoginPage | Authentication | UC-01 |
| 2 | ForgotPasswordPage | Authentication | UC-03 |
| 3 | ResetPasswordPage | Authentication | UC-04 |
| 4 | DashboardPage | Dashboard | UC-18 |
| 5 | ProfilePage | Authentication | UC-05, UC-06 |
| 6 | ChangePasswordPage | Authentication | UC-07 |
| 7 | UsersPage | User Management | UC-08 |
| 8 | UserCreatePage | User Management | UC-09 |
| 9 | UserEditPage | User Management | UC-11 |
| 10 | UserDetailPage | User Management | UC-08 |
| 11 | RolesPage | User Management | UC-13 |
| 12 | RoleCreatePage | User Management | UC-14 |
| 13 | RoleEditPage | User Management | UC-15 |
| 14 | PermissionsPage | User Management | UC-17 |
| 15 | ProductsPage | Product Management | UC-20 |
| 16 | ProductCreatePage | Product Management | UC-21 |
| 17 | ProductEditPage | Product Management | UC-22 |
| 18 | ProductDetailPage | Product Management | UC-26 |
| 19 | CategoriesPage | Product Management | UC-24 |
| 20 | UnitsPage | Product Management | UC-25 |
| 21 | SuppliersPage | Supplier Management | UC-32 |
| 22 | SupplierCreatePage | Supplier Management | UC-33 |
| 23 | SupplierEditPage | Supplier Management | UC-34 |
| 24 | SupplierDetailPage | Supplier Management | UC-32 |
| 25 | CustomersPage | Customer Management | UC-36 |
| 26 | CustomerCreatePage | Customer Management | UC-37 |
| 27 | CustomerEditPage | Customer Management | UC-38 |
| 28 | CustomerDetailPage | Customer Management | UC-36 |
| 29 | PurchasesPage | Purchase Management | UC-40 |
| 30 | PurchaseCreatePage | Purchase Management | UC-41 |
| 31 | PurchaseDetailPage | Purchase Management | UC-46 |
| 32 | PurchaseEditPage | Purchase Management | UC-42 |
| 33 | SalesPage | Sales Management | UC-47 |
| 34 | SaleCreatePage | Sales Management | UC-48 |
| 35 | SaleDetailPage | Sales Management | UC-53 |
| 36 | SaleEditPage | Sales Management | UC-49 |
| 37 | ExpensesPage | Expense Management | UC-54 |
| 38 | ExpenseCreatePage | Expense Management | UC-55 |
| 39 | ExpenseEditPage | Expense Management | UC-56 |
| 40 | ExpenseCategoriesPage | Expense Management | UC-58 |
| 41 | InventoryPage | Inventory Management | UC-30 |
| 42 | StockInPage | Inventory Management | UC-27 |
| 43 | StockOutPage | Inventory Management | UC-28 |
| 44 | StockAdjustmentPage | Inventory Management | UC-29 |
| 45 | StockHistoryPage | Inventory Management | UC-31 |
| 46 | SalesReportPage | Reports | UC-59 |
| 47 | PurchaseReportPage | Reports | UC-60 |
| 48 | InventoryReportPage | Reports | UC-61 |
| 49 | ExpenseReportPage | Reports | UC-62 |
| 50 | NotificationsPage | Notifications | UC-66, UC-67 |
| 51 | ActivityLogsPage | Activity Logs | UC-65 |
| 52 | LoginLogsPage | Activity Logs | UC-64 |
| 53 | CompanySettingsPage | Settings | UC-69 |
| 54 | AppSettingsPage | Settings | UC-70 |
| 55 | NotFoundPage | — | — |

---

## 6.6 Navigation Behavior

| Behavior | Desktop | Tablet | Mobile |
|---|---|---|---|
| **Sidebar** | Fixed, always visible | Collapsible (icon-only mode) | Hidden (drawer) |
| **Header** | Fixed top bar | Fixed top bar | Fixed top bar |
| **Bottom Nav** | Not shown | Not shown | Bottom tab bar |
| **Breadcrumb** | Yes (below header) | Yes | Hidden on subpages |
| **Search** | Global search in header | Global search in header | Search icon → overlay |

### Layout Components

```
┌──────────────────────────────────────────────┐
│  HEADER                                       │
│  ┌───────┬────────────────────────┬────────┐ │
│  │ ☰ Menu│  🔍 Search    │ 🔔 👤    │ │
│  └───────┴────────────────────────┴────────┘ │
├──────┬───────────────────────────────────────┤
│      │  BREADCRUMB                            │
│ SIDE │  Dashboard > Products                  │
│ BAR  ├───────────────────────────────────────┤
│      │                                        │
│      │           CONTENT AREA                 │
│      │                                        │
│      │                                        │
│      │                                        │
│      │                                        │
│      │                                        │
│      └───────────────────────────────────────┘
│                                              │
└──────────────────────────────────────────────┘
```

---

--- _End of Phase 6 — Application Sitemap_ ---
