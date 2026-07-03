# PHASE 17: IMPLEMENTATION ROADMAP — Hideo ERP

---

## 17.1 Timeline Overview

```
Week 1  ── Setup & Authentication
Week 2  ── User Management & Dashboard
Week 3  ── Product & Master Data
Week 4  ── Inventory Management
Week 5  ── Supplier & Customer + Purchase
Week 6  ── Sales & Expense
Week 7  ── Reports, Logs, Notifications, Settings
Week 8  ── Testing, Optimization, Polish
```

---

## 17.2 Sprint Breakdown

### Sprint 1: Project Setup + Auth (Week 1)

| Day | Task | Backend | Frontend |
|---|---|---|---|
| 1 | Init Laravel 12 + React 19 + Vite | `laravel new hideo-erp`, config .env, database, Sanctum | `npm create vite`, install React, TypeScript, Tailwind, shadcn |
| 2 | Setup infrastructure | Redis config, Queue config, Spatie Permission install, Models migration | Axios client, TanStack Query setup, Zustand stores, routing |
| 3 | Auth backend | Login, Logout, Forgot Password, Reset Password APIs | Login page, forgot/reset password pages, auth store |
| 4 | Auth frontend | Profile APIs (view, edit, change password) | Profile pages, protected route, auth guard |
| 5 | Testing + Polish | Auth feature tests (Pest) | Auth component + hook tests (Vitest) |

**Deliverable:** User can login, logout, reset password, view/edit profile.

---

### Sprint 2: User Management + Dashboard (Week 2)

| Day | Task | Backend | Frontend |
|---|---|---|---|
| 1 | User CRUD | UserController, UserService, StoreUserRequest, UserResource | Users list page, create/edit forms |
| 2 | Role & Permission | RoleController, PermissionController, RoleService | Roles list, create/edit with permission checkboxes |
| 3 | Seeder + RBAC | RolePermissionSeeder, default roles (sa, owner, manager, staff) | Permission-based UI rendering |
| 4 | Dashboard | DashboardService, aggregate queries, caching | Dashboard page with stats, charts, low stock, activity |
| 5 | Testing + Polish | User, Role, Dashboard feature tests | User/Role page component tests |

**Deliverable:** Complete RBAC working, dashboard shows real data.

---

### Sprint 3: Product Management (Week 3)

| Day | Task | Backend | Frontend |
|---|---|---|---|
| 1 | Category + Unit | CategoryController, UnitController, CRUD APIs | Category and Unit management pages |
| 2 | Product CRUD | ProductController, ProductService, StoreProductRequest | Products list page with search/filter/pagination |
| 3 | Product Create/Edit | Image upload, SKU auto-generate, barcode | Product form with validation, image upload |
| 4 | Product Detail | Product detail API with stock history | Product detail page, stock history table |
| 5 | Testing + Polish | Product CRUD tests, validation tests | Product component tests, schema tests |

**Deliverable:** Complete product management with categories, units, images, barcodes.

---

### Sprint 4: Inventory Management (Week 4)

| Day | Task | Backend | Frontend |
|---|---|---|---|
| 1 | Stock In | StockIn API + StockMovementService + stock increment | Stock In form with product selector |
| 2 | Stock Out | StockOut API + stock decrement + availability check | Stock Out form with validation |
| 3 | Stock Adjustment | Adjustment API + reason + approval flow | Adjustment form with reason |
| 4 | Stock History | History API with filters, stock_movements query | History page with product filter, date range |
| 5 | Testing + Polish | Inventory tests (stock in/out/adjustment + edge cases) | Inventory component tests |

**Deliverable:** Complete inventory tracking with full audit trail.

---

### Sprint 5: Supplier + Customer + Purchase (Week 5)

| Day | Task | Backend | Frontend |
|---|---|---|---|
| 1 | Supplier CRUD | Supplier APIs | Supplier pages |
| 2 | Customer CRUD | Customer APIs | Customer pages |
| 3 | Purchase CRUD | PurchaseController, PurchaseService, purchase_number auto-gen | Purchase list, create form with dynamic items |
| 4 | Purchase Approval | Approve flow, receive flow (auto stock in) | Approve button, receive form, status badges |
| 5 | Testing + Polish | Purchase tests (CRUD, approve, receive, edge cases) | Purchase component + hook tests |

**Deliverable:** Complete supplier, customer, and purchase management with approval workflow.

---

### Sprint 6: Sales + Expense (Week 6)

| Day | Task | Backend | Frontend |
|---|---|---|---|
| 1 | Sales CRUD | SaleController, SaleService, sale_number + invoice_number auto-gen | Sales list, create form with dynamic items |
| 2 | Payment | Payment status update (unpaid → partial → paid) | Payment form, invoice view (print-friendly) |
| 3 | Expense + Category | Expense CRUD, Expense Category CRUD | Expense pages, category pages |
| 4 | Sales validation | Stock availability check on sale, stock decrement on complete | Stock validation before submit, error handling |
| 5 | Testing + Polish | Sales + Expense tests (CRUD, payment, stock validation) | Sales + Expense component tests |

**Deliverable:** Complete sales with payment tracking and expense management.

---

### Sprint 7: Reports + Logs + Notifications + Settings (Week 7)

| Day | Task | Backend | Frontend |
|---|---|---|---|
| 1 | Reports | ReportService, Sales/Purchase/Inventory/Expense report APIs | Report pages with date filters, tables, charts |
| 2 | Export Reports | PDF/Excel export (queue-based for large data) | Export buttons, download handling |
| 3 | Activity Logs | ActivityLogService, LoginLog APIs | Activity logs page, login logs page with filters |
| 4 | Notifications | In-app notification system, auto-generate on low stock | Notification bell, dropdown, list page |
| 5 | Settings | Company profile, app settings APIs | Settings pages (company, application) |

**Deliverable:** Complete reports, logs, notifications, and settings modules.

---

### Sprint 8: Testing + Optimization + Polish (Week 8)

| Day | Task | Description |
|---|---|---|
| 1 | Backend tests | Complete all feature tests, achieve > 85% coverage |
| 2 | Frontend tests | Complete all component/hook/schema tests, > 80% coverage |
| 3 | Performance audit | Lighthouse audit, optimize bundle, lazy loading |
| 4 | Security audit | Review auth, authorization, input validation, CSRF, headers |
| 5 | Responsive QA | Test all pages on mobile, tablet, desktop |
| 6 | Bug fixes + Polish | Fix remaining issues, UI polish |
| 7 | Documentation | README, API docs, deployment guide |
| 8 | Release | Tag v1.0.0, prepare for deployment |

**Deliverable:** Production-ready Hideo ERP v1.0.0.

---

## 17.3 Dependencies & Blockers

```
Week 1: Setup + Auth ───────────────────────────────┐
    │                                                 │
    ▼                                                 │
Week 2: User Mgmt + Dashboard ───────────────────────┤
    │                                                 │
    ▼                                                 │
Week 3: Product Management ──────────────────────────┤
    │                                                 │
    ├── Category & Unit (pre-requisite for Product)   │
    │                                                 │
    ▼                                                 │
Week 4: Inventory ──────────────────────────────────┤
    │  (requires Product)                             │
    ▼                                                 │
Week 5: Supplier + Customer + Purchase ─────────────┤
    │  ├── Supplier (for Purchase)                    │
    │  ├── Products (for Purchase Items)              │
    │  └── Inventory (Stock In on receive)            │
    │                                                 │
    ▼                                                 │
Week 6: Sales + Expense ────────────────────────────┤
    │  ├── Products (for Sale Items)                  │
    │  ├── Customer (for Sales)                      │
    │  └── Inventory (Stock Out on sale)              │
    │                                                 │
    ▼                                                 │
Week 7: Reports + Logs + Notifications + Settings ──┘
    │  (requires data from all previous modules)
    │
    ▼
Week 8: Testing + Optimization + Polish
```

---

## 17.4 Milestones

| Milestone | Week | Description |
|---|---|---|
| **M1: Auth Working** | W1 | Login, logout, password reset, profile |
| **M2: RBAC Complete** | W2 | Users, roles, permissions, dashboard |
| **M3: Master Data Done** | W3 | Products, categories, units |
| **M4: Inventory Live** | W4 | Stock in/out/adjustment/history |
| **M5: Purchases Active** | W5 | Suppliers, customers, PO with approval |
| **M6: Sales & Expenses** | W6 | SO with payment, expenses |
| **M7: Full Feature Set** | W7 | Reports, logs, notifications, settings |
| **M8: Production Ready** | W8 | Tested, optimized, documented |

---

## 17.5 Resource Estimation

| Role | Hours/Week | Weeks | Total |
|---|---|---|---|
| Full Stack Developer | 40h | 8 | 320h |
| QA Engineer (Week 8) | 40h | 1 | 40h |
| **Total** | | | **360h** |

### Effort Distribution

```
Backend  :  45%  (PHP, Laravel, DB, Redis, Testing)
Frontend :  40%  (React, TypeScript, UI, State, Testing)
DevOps   :   5%  (Docker, CI/CD, Deployment)
Testing  :  10%  (Unit, Feature, Integration, E2E)
```

---

## 17.6 Risk Management

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Scope creep | Medium | High | Strict P0/P1 prioritization, defer P2/P3 |
| Performance issues | Low | Medium | Early Lighthouse checks, Redis caching, query optimization |
| Security vulnerabilities | Low | High | SAST scanning, dependency audit, security checklist |
| Integration issues (BE-FE) | Medium | Medium | Define API contracts first (Phase 10), use TypeScript types |
| Developer bandwidth | Low | High | Realistic timeline, buffer in Week 8 |

---

## 17.7 Deployment Strategy

```yaml
# Stage 1: Development (local)
- Docker Compose (Laravel + MySQL + Redis + Vite)

# Stage 2: Staging
- VPS / DigitalOcean Droplet
- Laravel Forge for deployment
- Staging domain: staging.hideoerp.com

# Stage 3: Production
- VPS / AWS EC2
- Laravel Forge / Laravel Vapor
- Domain: app.hideoerp.com
- SSL: Let's Encrypt
- CDN: Cloudflare
```

---

## 17.8 Post-Launch Roadmap

| Phase | Timeline | Features |
|---|---|---|
| **v1.0** | Week 8 | MVP — all P0 + P1 features |
| **v1.1** | Month 2 | P2 features: Charts, Export PDF/Excel, Barcode print |
| **v1.2** | Month 3 | Multi-warehouse, Sales Return, Import Excel |
| **v2.0** | Quarter 2 | HR module, Payroll, Multi-currency, E-commerce API |

---

--- _End of Phase 17 — Implementation Roadmap_ ---
