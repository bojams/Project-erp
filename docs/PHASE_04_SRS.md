# PHASE 4: SOFTWARE REQUIREMENTS SPECIFICATION (SRS) — Hideo ERP

---

**Document Version:** 1.0
**Project Name:** Hideo ERP
**Prepared By:** Hideo Engineering Team
**Date:** June 2026

---

## Table of Contents

1. Introduction
2. Business Goals
3. User Requirements
4. Functional Requirements
5. Non-Functional Requirements
6. Use Cases
7. Constraints

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete description of the Hideo ERP system. It defines the functional and non-functional requirements, business goals, user needs, and system constraints. This document serves as the primary reference for the architecture design, implementation, and testing phases.

### 1.2 Scope

Hideo ERP is a web-based Enterprise Resource Planning system designed specifically for Indonesian UMKM (Usaha Mikro, Kecil, dan Menengah). The system covers:

- **Authentication & User Management** — Role-based access control for 4 role levels
- **Dashboard** — Real-time business intelligence with key metrics
- **Product & Inventory Management** — End-to-end product lifecycle and stock tracking
- **Supplier & Customer Management** — Contact and transaction history management
- **Purchase & Sales Management** — Complete order-to-cash and procure-to-pay workflows
- **Expense Management** — Operational expense tracking and categorization
- **Reporting** — Business reports with filtering and export capabilities
- **Activity Logging** — Complete audit trail for all user actions
- **Notification System** — In-app alerts for critical business events

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| ERP | Enterprise Resource Planning |
| UMKM | Usaha Mikro, Kecil, dan Menengah (MSME) |
| RBAC | Role-Based Access Control |
| SRS | Software Requirements Specification |
| PO | Purchase Order |
| SO | Sales Order |
| SKU | Stock Keeping Unit |
| API | Application Programming Interface |
| SPA | Single Page Application |
| CRUD | Create, Read, Update, Delete |
| P0/P1/P2/P3 | Priority levels (Critical/High/Medium/Nice) |

### 1.4 References

| Reference | Source |
|---|---|
| AGENTS.md | Project root — Coding standards and architecture rules |
| Phase 1 — Business Analysis | hideo_erp/PHASE_01_BUSINESS_ANALYSIS.md |
| Phase 2 — Role & Permission | hideo_erp/PHASE_02_ROLE_PERMISSION_ANALYSIS.md |
| Phase 3 — Feature Planning | hideo_erp/PHASE_03_FEATURE_PLANNING.md |
| Laravel 12 Documentation | https://laravel.com/docs/12.x |
| React 19 Documentation | https://react.dev/ |
| Spatie Laravel Permission | https://spatie.be/docs/laravel-permission |

### 1.5 Overview

This SRS is organized into 7 sections. Section 1 provides the introduction. Section 2 describes business goals. Section 3 covers user requirements. Section 4 details functional requirements. Section 5 specifies non-functional requirements. Section 6 outlines use cases. Section 7 defines project constraints.

---

## 2. Business Goals

| Goal ID | Goal Description | Success Metric |
|---|---|---|
| BG-01 | Digitalisasi operasional UMKM menggantikan pencatatan manual | 100% transaksi tercatat di sistem dalam 3 bulan |
| BG-02 | Menyediakan data bisnis real-time untuk pengambilan keputusan | Dashboard diakses minimal 1x/hari oleh Owner/Manager |
| BG-03 | Mengurangi human error dalam pencatatan stok dan keuangan | 0 selisih stok akibat human error dalam 6 bulan |
| BG-04 | Meningkatkan efisiensi operasional melalui workflow otomatis | Waktu processing PO turun 50% |
| BG-05 | Menjaga keamanan data bisnis dengan RBAC | 0 akses tidak sah ke data sensitif |
| BG-06 | Menyediakan laporan akurat untuk analisis bisnis | Laporan tersedia dalam 1 klik, tanpa perlu rekap manual |

---

## 3. User Requirements

### 3.1 User Personas

#### Persona 1: Super Admin (Budi — IT Administrator)
- **Usia:** 28
- **Latar Belakang:** Lulusan Teknik Informatika
- **Kebutuhan:** Konfigurasi sistem, manage user & permission, monitoring aktivitas
- **Pain Point:** Ingin kontrol penuh tanpa hambatan, perlu audit trail lengkap
- **Device:** Laptop (Desktop view utama)

#### Persona 2: Owner (Sari — Pemilik Toko Kelontong)
- **Usia:** 42
- **Latar Belakang:** Pengusaha retail, tidak terlalu teknis
- **Kebutuhan:** Melihat laporan penjualan, stok, dan keuntungan dengan cepat
- **Pain Point:** Tidak punya waktu untuk rekap manual, perlu data real-time
- **Device:** Smartphone + Laptop

#### Persona 3: Manager (Rudi — Manager Operasional)
- **Usia:** 35
- **Latar Belakang:** Berpengalaman di operasional gudang
- **Kebutuhan:** Memantau kinerja staff, approve transaksi, cek stok
- **Pain Point:** Sering dikejar owner untuk laporan, perlu approval workflow
- **Device:** Tablet + Laptop

#### Persona 4: Staff Gudang (Agus — Staff Gudang)
- **Usia:** 25
- **Latar Belakang:** SMA, basic computer literacy
- **Kebutuhan:** Input stok masuk/keluar, cek stok fisik
- **Pain Point:** UI harus simpel dan cepat, tidak perlu fitur kompleks
- **Device:** Smartphone (mobile-first)

#### Persona 5: Kasir (Dewi — Staff Penjualan)
- **Usia:** 23
- **Latar Belakang:** Pengalaman sebagai kasir
- **Kebutuhan:** Buat transaksi penjualan cepat, generate invoice
- **Pain Point:** Tidak boleh lambat karena antrean pelanggan
- **Device:** Laptop/Tablet

### 3.2 User Environment
- **Operating System:** Cross-platform (Windows, macOS, Linux)
- **Browser:** Chrome 120+, Firefox 115+, Safari 16+, Edge 120+
- **Device:** Responsive design untuk mobile, tablet, laptop, desktop, ultrawide
- **Network:** Koneksi internet minimal 1 Mbps

---

## 4. Functional Requirements

### 4.1 Module: Authentication (AUTH)

| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-01 | Sistem harus menyediakan endpoint login dengan email dan password | P0 |
| FR-AUTH-02 | Sistem harus memvalidasi kredensial dan mengembalikan token Sanctum | P0 |
| FR-AUTH-03 | Sistem harus merevoke token saat logout | P0 |
| FR-AUTH-04 | Token harus memiliki expiry time (configurable) | P1 |
| FR-AUTH-05 | Sistem harus mengirim email reset password dengan link valid 60 menit | P0 |
| FR-AUTH-06 | User harus bisa mengganti password sendiri dengan verifikasi password lama | P1 |
| FR-AUTH-07 | User harus bisa mengupdate profil (nama, foto) | P1 |
| FR-AUTH-08 | Sistem harus mencatat login attempt (success/failed) dengan timestamp | P1 |

### 4.2 Module: User Management (USER)

| ID | Requirement | Priority |
|---|---|---|
| FR-USER-01 | Sistem harus menyediakan CRUD user dengan soft delete | P0 |
| FR-USER-02 | Sistem harus mendukung RBAC dengan Spatie Laravel Permission | P0 |
| FR-USER-03 | Sistem harus menyediakan CRUD role dengan permission assignment | P0 |
| FR-USER-04 | Sistem harus menampilkan daftar permission (read-only untuk non-Super Admin) | P1 |
| FR-USER-05 | Sistem harus memiliki seeder untuk role default dan Super Admin default | P0 |
| FR-USER-06 | Sistem harus memvalidasi bahwa email user bersifat unique | P0 |
| FR-USER-07 | Hanya Super Admin yang bisa create/edit/delete user dan role | P0 |

### 4.3 Module: Dashboard (DASH)

| ID | Requirement | Priority |
|---|---|---|
| FR-DASH-01 | Dashboard harus menampilkan total revenue hari ini dengan perbandingan | P0 |
| FR-DASH-02 | Dashboard harus menampilkan total pengeluaran hari ini | P1 |
| FR-DASH-03 | Dashboard harus menampilkan 10 aktivitas terbaru (timeline) | P0 |
| FR-DASH-04 | Dashboard harus menampilkan daftar produk dengan stok di bawah minimal | P0 |
| FR-DASH-05 | Dashboard harus menampilkan kartu statistik (produk, pelanggan, supplier) | P1 |
| FR-DASH-06 | Data dashboard harus real-time (refetch period configurable) | P1 |

### 4.4 Module: Product Management (PROD)

| ID | Requirement | Priority |
|---|---|---|
| FR-PROD-01 | Produk harus memiliki: nama, SKU (unique), kategori, unit, harga beli, harga jual, stok, stok minimal, deskripsi | P0 |
| FR-PROD-02 | Sistem harus mendukung upload image produk (max 2MB, format: jpg/png/webp) | P2 |
| FR-PROD-03 | Sistem harus generate barcode (code128) untuk setiap produk | P2 |
| FR-PROD-04 | Produk harus memiliki relasi ke kategori (optional) | P1 |
| FR-PROD-05 | Produk harus memiliki relasi ke unit (mandatory) | P1 |
| FR-PROD-06 | Sistem harus menyediakan CRUD kategori produk | P1 |
| FR-PROD-07 | Sistem harus menyediakan CRUD satuan produk | P1 |
| FR-PROD-08 | SKU harus unique dan auto-generate, tapi bisa diubah manual | P1 |
| FR-PROD-09 | Harga jual harus >= harga beli (validasi) | P1 |
| FR-PROD-10 | Sistem harus menyediakan search, filter kategori, sort, pagination untuk produk | P0 |

### 4.5 Module: Inventory Management (INV)

| ID | Requirement | Priority |
|---|---|---|
| FR-INV-01 | Stok bertambah saat Stock In dikonfirmasi | P0 |
| FR-INV-02 | Stok berkurang saat Sales Order dikonfirmasi | P0 |
| FR-INV-03 | Stok dapat disesuaikan melalui Stock Adjustment (+/-) dengan alasan | P1 |
| FR-INV-04 | Setiap perubahan stok harus tercatat di Stock History | P1 |
| FR-INV-05 | Stock history harus mencatat: tipe (in/out/adjustment), qty, reference, user, timestamp | P1 |
| FR-INV-06 | Stok minimal harus bisa dikonfigurasi per produk | P0 |
| FR-INV-07 | Transaksi yang mengurangi stok harus validasi ketersediaan stok | P0 |

### 4.6 Module: Supplier Management (SUPP)

| ID | Requirement | Priority |
|---|---|---|
| FR-SUPP-01 | Supplier harus memiliki: nama, kontak, telepon, email, alamat, NPWP (opsional) | P0 |
| FR-SUPP-02 | Sistem harus menyediakan CRUD supplier dengan soft delete | P0 |
| FR-SUPP-03 | Supplier yang sudah memiliki transaksi pembelian tidak bisa dihapus permanen | P1 |

### 4.7 Module: Customer Management (CUST)

| ID | Requirement | Priority |
|---|---|---|
| FR-CUST-01 | Customer harus memiliki: nama, kontak, telepon, email, alamat | P0 |
| FR-CUST-02 | Sistem harus menyediakan CRUD customer dengan soft delete | P0 |
| FR-CUST-03 | Customer yang sudah memiliki transaksi penjualan tidak bisa dihapus permanen | P1 |

### 4.8 Module: Purchase Management (PURCH)

| ID | Requirement | Priority |
|---|---|---|
| FR-PURCH-01 | Purchase Order harus memiliki: nomor PO (auto generate), supplier, tanggal, status, items, total | P0 |
| FR-PURCH-02 | Status PO: pending, approved, received, cancelled | P0 |
| FR-PURCH-03 | Items PO: produk, qty, harga beli, subtotal | P0 |
| FR-PURCH-04 | Sistem harus auto update total berdasarkan items | P0 |
| FR-PURCH-05 | PO hanya bisa diedit/dihapus jika status pending | P1 |
| FR-PURCH-06 | Manager/Owner dapat approve PO (ubah status pending → approved) | P1 |
| FR-PURCH-07 | Saat PO di-receive, sistem auto create Stock In dan update stok | P1 |
| FR-PURCH-08 | Sistem harus menyediakan search, filter status, date range, pagination | P0 |

### 4.9 Module: Sales Management (SALE)

| ID | Requirement | Priority |
|---|---|---|
| FR-SALE-01 | Sales Order harus memiliki: nomor SO (auto generate), customer, tanggal, status, items, total | P0 |
| FR-SALE-02 | Status SO: pending, completed, cancelled | P0 |
| FR-SALE-03 | Items SO: produk, qty, harga jual, subtotal | P0 |
| FR-SALE-04 | Status Payment: unpaid, partial, paid | P0 |
| FR-SALE-05 | Sistem harus auto update total berdasarkan items | P0 |
| FR-SALE-06 | Saat SO dibuat (status completed), sistem auto kurangi stok | P0 |
| FR-SALE-07 | Sistem harus validasi stok cukup sebelum SO diproses | P0 |
| FR-SALE-08 | Sistem harus auto generate nomor invoice | P1 |
| FR-SALE-09 | SO hanya bisa diedit/dihapus jika status pending | P1 |
| FR-SALE-10 | Payment status bisa diupdate (unpaid → partial → paid) | P1 |

### 4.10 Module: Expense Management (EXP)

| ID | Requirement | Priority |
|---|---|---|
| FR-EXP-01 | Expense harus memiliki: deskripsi, jumlah, kategori, tanggal, bukti (opsional) | P0 |
| FR-EXP-02 | Sistem harus menyediakan CRUD expense | P0 |
| FR-EXP-03 | Sistem harus menyediakan CRUD kategori expense | P1 |
| FR-EXP-04 | Sistem harus menyediakan filter by kategori, date range, pagination | P0 |

### 4.11 Module: Reports (REP)

| ID | Requirement | Priority |
|---|---|---|
| FR-REP-01 | Sales report: date range filter, status filter, total penjualan, jumlah transaksi | P1 |
| FR-REP-02 | Purchase report: date range filter, status filter, total pembelian, jumlah transaksi | P1 |
| FR-REP-03 | Inventory report: filter by kategori, low stock filter, stok saat ini | P1 |
| FR-REP-04 | Expense report: date range filter, kategori filter, total pengeluaran | P1 |
| FR-REP-05 | Setiap report harus bisa ditampilkan dalam bentuk tabel + chart (bar/line) | P2 |
| FR-REP-06 | Report harus bisa diexport ke PDF dan Excel | P2 |

### 4.12 Module: Activity Logs (LOG)

| ID | Requirement | Priority |
|---|---|---|
| FR-LOG-01 | Sistem harus mencatat login log (user, timestamp, IP address, user agent, success/failed) | P1 |
| FR-LOG-02 | Sistem harus mencatat activity log setiap create/update/delete dengan detail perubahan | P1 |
| FR-LOG-03 | Activity log harus bisa difilter by user, action, module, date range | P2 |

### 4.13 Module: Notifications (NOTIF)

| ID | Requirement | Priority |
|---|---|---|
| FR-NOTIF-01 | Sistem harus menampilkan notifikasi in-app (bell icon + dropdown) | P1 |
| FR-NOTIF-02 | Sistem auto generate notifikasi saat stok produk di bawah minimal | P1 |
| FR-NOTIF-03 | Sistem auto generate notifikasi untuk PO yang perlu approval | P2 |
| FR-NOTIF-04 | User bisa mark notifikasi as read | P1 |
| FR-NOTIF-05 | User bisa mark all notifikasi as read | P2 |
| FR-NOTIF-06 | Notifikasi harus menampilkan: title, message, type, timestamp, read status | P1 |

### 4.14 Module: Settings (SET)

| ID | Requirement | Priority |
|---|---|---|
| FR-SET-01 | Company profile: nama, alamat, telepon, email, logo (upload) | P1 |
| FR-SET-02 | App settings: currency, timezone, date format, low stock threshold default | P1 |
| FR-SET-03 | Settings hanya bisa diubah oleh Super Admin / Owner | P1 |

---

## 5. Non-Functional Requirements

| ID | Category | Description | Target |
|---|---|---|---|
| NFR-01 | Performance | API response time for 95% of requests | < 500ms |
| NFR-02 | Performance | Lighthouse Performance score | > 90 |
| NFR-03 | Performance | First Contentful Paint (FCP) | < 2s |
| NFR-04 | Performance | Largest Contentful Paint (LCP) | < 2.5s |
| NFR-05 | Performance | Cumulative Layout Shift (CLS) | < 0.1 |
| NFR-06 | Scalability | Maximum concurrent users | 500+ |
| NFR-07 | Scalability | Database record capacity | > 10 million rows |
| NFR-08 | Availability | System uptime | > 99.5% |
| NFR-09 | Security | Password hashing algorithm | bcrypt |
| NFR-10 | Security | API authentication | Sanctum token-based |
| NFR-11 | Security | Authorization | Spatie RBAC — every request authorized |
| NFR-12 | Security | CSRF protection | Enabled for all non-API routes |
| NFR-13 | Security | Rate limiting | Login: 5 attempts/min, API: 60 req/min |
| NFR-14 | Security | Input validation | Server-side for all inputs |
| NFR-15 | Security | XSS protection | Output escaping, CSP headers |
| NFR-16 | Security | SQL injection protection | Parameterized queries via Eloquent |
| NFR-17 | Maintainability | Backend architecture | Service Layer pattern |
| NFR-18 | Maintainability | Frontend architecture | Feature-based folder structure |
| NFR-19 | Maintainability | Code standards | PSR-12 (PHP), ESLint (TS) |
| NFR-20 | Responsiveness | Device support | Mobile, Tablet, Laptop, Desktop, Ultrawide |
| NFR-21 | Responsiveness | Design approach | Mobile First |
| NFR-22 | Accessibility | WCAG compliance | WCAG 2.1 Level AA |
| NFR-23 | Reliability | Error handling | All layers: try-catch, error boundaries |
| NFR-24 | Reliability | Database transactions | For critical operations (payment, stock) |
| NFR-25 | Testability | Code coverage | Minimum 80% |
| NFR-26 | Testability | Critical logic coverage | 100% |
| NFR-27 | Usability | Loading/Error/Empty states | Every component |
| NFR-28 | Security | Sensitive data exposure | No passwords, tokens, secrets in logs |

---

## 6. Use Cases

*(Detailed use cases to be expanded in Phase 5 — Use Case Design)*

| UC ID | Use Case Name | Primary Actor |
|---|---|---|
| UC-01 | Login | All Users |
| UC-02 | Manage Users | Super Admin |
| UC-03 | Manage Roles | Super Admin |
| UC-04 | View Dashboard | All Users |
| UC-05 | Manage Products | Manager, Staff |
| UC-06 | Manage Inventory | Manager, Staff |
| UC-07 | Manage Suppliers | Manager, Staff |
| UC-08 | Manage Customers | Manager, Staff |
| UC-09 | Create Purchase Order | Staff, Manager |
| UC-10 | Approve Purchase Order | Manager, Owner |
| UC-11 | Create Sales Order | Staff, Manager |
| UC-12 | Process Payment | Manager, Staff |
| UC-13 | Manage Expenses | Manager, Staff |
| UC-14 | View Reports | Manager, Owner |
| UC-15 | View Activity Logs | Super Admin, Owner |
| UC-16 | Manage Settings | Super Admin, Owner |

---

## 7. Constraints

### 7.1 Technical Constraints

| Constraint | Description |
|---|---|
| C-01 | Backend must use Laravel 12 with PHP 8.4+ |
| C-02 | Frontend must use React 19 with TypeScript, Vite |
| C-03 | Database must use MySQL 8+ |
| C-04 | Cache must use Redis |
| C-05 | Authentication must use Laravel Sanctum |
| C-06 | Authorization must use Spatie Laravel Permission |
| C-07 | UI must use Tailwind CSS 4 + shadcn/ui |
| C-08 | State management: Zustand for UI, TanStack Query for server state |
| C-09 | Forms: React Hook Form + Zod validation |
| C-10 | Testing: Pest PHP (backend), Vitest (frontend) |

### 7.2 Business Constraints

| Constraint | Description |
|---|---|
| C-11 | System must support Bahasa Indonesia as primary language |
| C-12 | Default currency: Indonesian Rupiah (IDR) |
| C-13 | System must comply with Indonesian tax regulations (PPN) |
| C-14 | Target users have varying technical literacy — UI must be intuitive |

### 7.3 Design Constraints

| Constraint | Description |
|---|---|
| C-15 | All pages must be fully responsive (mobile-first) |
| C-16 | Must support dark mode and light mode |
| C-17 | No usage of jQuery, Bootstrap, Material UI, or Ant Design |
| C-18 | Business logic must NEVER be in Controllers (must use Services) |
| C-19 | API responses must follow standard format: `{ success, message, data }` |

### 7.4 Deployment Constraints

| Constraint | Description |
|---|---|
| C-20 | System should be deployable via Docker |
| C-21 | Environment configuration via .env file |

---

--- _End of Phase 4 — SRS_ ---
