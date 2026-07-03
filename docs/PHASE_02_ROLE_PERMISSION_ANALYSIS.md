# PHASE 2: ROLE & PERMISSION ANALYSIS — Hideo ERP

---

## 2.1 RBAC Architecture

Menggunakan **Spatie Laravel Permission** dengan konsep:

```
User → (belongsToMany) → Role → (belongsToMany) → Permission
```

### Hierarchy Roles

```
┌──────────────────────────────────────────────────────┐
│                   SUPER ADMIN                         │
│       Akses penuh ke seluruh sistem + konfigurasi     │
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│                      OWNER                             │
│        Akses penuh ke bisnis (tanpa konfigurasi teknis)│
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│                     MANAGER                            │
│    Akses operasional + approval + laporan              │
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│                      STAFF                             │
│             Akses terbatas sesuai jobdesc              │
└──────────────────────────────────────────────────────┘
```

**Prinsip:** Setiap level lebih rendah mewarisi permission dari level di atasnya secara hirarkis, namun dengan batasan yang lebih ketat.

---

## 2.2 Role Definitions

### 1. Super Admin

| Atribut | Value |
|---|---|
| **Deskripsi** | Administrator teknis sistem |
| **Tujuan** | Mengelola konfigurasi teknis, user, role, permission, dan settings aplikasi |
| **Akses** | 100% seluruh sistem tanpa pengecualian |
| **Jumlah** | 1 orang (tidak bisa dihapus, hanya bisa diedit) |

### 2. Owner

| Atribut | Value |
|---|---|
| **Deskripsi** | Pemilik bisnis / CEO |
| **Tujuan** | Memantau performa bisnis, mengakses laporan, mengelola pengaturan perusahaan |
| **Akses** | Semua fitur bisnis kecuali manajemen user/role/permission sistem |
| **Jumlah** | 1-N orang |

### 3. Manager

| Atribut | Value |
|---|---|
| **Deskripsi** | Manager operasional |
| **Tujuan** | Mengelola operasi harian, menyetujui transaksi, memantau stok dan karyawan |
| **Akses** | Operasional penuh, dapat approve, tidak bisa hapus permanen |
| **Jumlah** | 1-N orang |

### 4. Staff

| Atribut | Value |
|---|---|
| **Deskripsi** | Staff operasional (gudang, kasir, pembelian, keuangan) |
| **Tujuan** | Melaksanakan tugas operasional sesuai divisi |
| **Akses** | Terbatas pada modul sesuai jobdesc, tidak bisa approve, tidak bisa hapus |
| **Jumlah** | 1-N orang |

---

## 2.3 Daftar Permission Lengkap

### Konvensi Penamaan Permission

Format: `{action}-{module}`

| Action | Keterangan |
|---|---|
| `view` | Melihat data |
| `create` | Membuat data baru |
| `edit` | Mengedit data |
| `delete` | Menghapus data |
| `approve` | Menyetujui transaksi |
| `export` | Mengekspor data |

### A. Authentication & Profile

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| Login | `auth-login` | ✅ | ✅ | ✅ | ✅ |
| Logout | `auth-logout` | ✅ | ✅ | ✅ | ✅ |
| View Profile | `view-profile` | ✅ | ✅ | ✅ | ✅ |
| Edit Profile | `edit-profile` | ✅ | ✅ | ✅ | ✅ |
| Change Password | `change-password` | ✅ | ✅ | ✅ | ✅ |

### B. User Management

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Users | `view-users` | ✅ | ✅ | ✅ | ❌ |
| Create Users | `create-users` | ✅ | ❌ | ❌ | ❌ |
| Edit Users | `edit-users` | ✅ | ❌ | ❌ | ❌ |
| Delete Users | `delete-users` | ✅ | ❌ | ❌ | ❌ |
| View Roles | `view-roles` | ✅ | ✅ | ❌ | ❌ |
| Create Roles | `create-roles` | ✅ | ❌ | ❌ | ❌ |
| Edit Roles | `edit-roles` | ✅ | ❌ | ❌ | ❌ |
| Delete Roles | `delete-roles` | ✅ | ❌ | ❌ | ❌ |
| View Permissions | `view-permissions` | ✅ | ✅ | ❌ | ❌ |
| Assign Permissions | `assign-permissions` | ✅ | ❌ | ❌ | ❌ |

### C. Dashboard

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Dashboard | `view-dashboard` | ✅ | ✅ | ✅ | ✅ |

### D. Product Management

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Products | `view-products` | ✅ | ✅ | ✅ | ✅ |
| Create Products | `create-products` | ✅ | ✅ | ✅ | ✅ |
| Edit Products | `edit-products` | ✅ | ✅ | ✅ | ❌ |
| Delete Products | `delete-products` | ✅ | ✅ | ✅ | ❌ |
| View Categories | `view-categories` | ✅ | ✅ | ✅ | ✅ |
| Create Categories | `create-categories` | ✅ | ✅ | ✅ | ❌ |
| Edit Categories | `edit-categories` | ✅ | ✅ | ✅ | ❌ |
| Delete Categories | `delete-categories` | ✅ | ✅ | ✅ | ❌ |
| View Units | `view-units` | ✅ | ✅ | ✅ | ✅ |
| Create Units | `create-units` | ✅ | ✅ | ✅ | ❌ |
| Edit Units | `edit-units` | ✅ | ✅ | ✅ | ❌ |
| Delete Units | `delete-units` | ✅ | ✅ | ✅ | ❌ |

### E. Inventory Management

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Inventory | `view-inventory` | ✅ | ✅ | ✅ | ✅ |
| Create Stock In | `create-stock-in` | ✅ | ✅ | ✅ | ✅ |
| Create Stock Out | `create-stock-out` | ✅ | ✅ | ✅ | ✅ |
| Create Stock Adjustment | `create-stock-adjustment` | ✅ | ✅ | ✅ | ❌ |
| Approve Stock Adjustment | `approve-stock-adjustment` | ✅ | ✅ | ✅ | ❌ |
| View Stock History | `view-stock-history` | ✅ | ✅ | ✅ | ✅ |

### F. Supplier Management

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Suppliers | `view-suppliers` | ✅ | ✅ | ✅ | ✅ |
| Create Suppliers | `create-suppliers` | ✅ | ✅ | ✅ | ✅ |
| Edit Suppliers | `edit-suppliers` | ✅ | ✅ | ✅ | ❌ |
| Delete Suppliers | `delete-suppliers` | ✅ | ✅ | ✅ | ❌ |

### G. Customer Management

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Customers | `view-customers` | ✅ | ✅ | ✅ | ✅ |
| Create Customers | `create-customers` | ✅ | ✅ | ✅ | ✅ |
| Edit Customers | `edit-customers` | ✅ | ✅ | ✅ | ❌ |
| Delete Customers | `delete-customers` | ✅ | ✅ | ✅ | ❌ |

### H. Purchase Management

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Purchases | `view-purchases` | ✅ | ✅ | ✅ | ✅ |
| Create Purchases | `create-purchases` | ✅ | ✅ | ✅ | ✅ |
| Edit Purchases | `edit-purchases` | ✅ | ✅ | ✅ | ❌ |
| Delete Purchases | `delete-purchases` | ✅ | ✅ | ✅ | ❌ |
| Approve Purchases | `approve-purchases` | ✅ | ✅ | ✅ | ❌ |

### I. Sales Management

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Sales | `view-sales` | ✅ | ✅ | ✅ | ✅ |
| Create Sales | `create-sales` | ✅ | ✅ | ✅ | ✅ |
| Edit Sales | `edit-sales` | ✅ | ✅ | ✅ | ❌ |
| Delete Sales | `delete-sales` | ✅ | ✅ | ✅ | ❌ |
| View Invoices | `view-invoices` | ✅ | ✅ | ✅ | ✅ |
| Create Invoices | `create-invoices` | ✅ | ✅ | ✅ | ✅ |
| Edit Invoice Status | `edit-invoice-status` | ✅ | ✅ | ✅ | ❌ |

### J. Expense Management

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Expenses | `view-expenses` | ✅ | ✅ | ✅ | ✅ |
| Create Expenses | `create-expenses` | ✅ | ✅ | ✅ | ✅ |
| Edit Expenses | `edit-expenses` | ✅ | ✅ | ✅ | ❌ |
| Delete Expenses | `delete-expenses` | ✅ | ✅ | ✅ | ❌ |
| View Expense Categories | `view-expense-categories` | ✅ | ✅ | ✅ | ✅ |
| Create Expense Categories | `create-expense-categories` | ✅ | ✅ | ✅ | ❌ |
| Edit Expense Categories | `edit-expense-categories` | ✅ | ✅ | ✅ | ❌ |
| Delete Expense Categories | `delete-expense-categories` | ✅ | ✅ | ✅ | ❌ |

### K. Reports

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Sales Report | `view-sales-report` | ✅ | ✅ | ✅ | ❌ |
| View Purchase Report | `view-purchase-report` | ✅ | ✅ | ✅ | ❌ |
| View Inventory Report | `view-inventory-report` | ✅ | ✅ | ✅ | ❌ |
| View Expense Report | `view-expense-report` | ✅ | ✅ | ✅ | ❌ |
| Export Reports | `export-reports` | ✅ | ✅ | ✅ | ❌ |

### L. Activity Logs

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Activity Logs | `view-activity-logs` | ✅ | ✅ | ✅ | ❌ |
| View Login Logs | `view-login-logs` | ✅ | ✅ | ❌ | ❌ |

### M. Notifications

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Notifications | `view-notifications` | ✅ | ✅ | ✅ | ✅ |
| Mark Notifications | `mark-notifications` | ✅ | ✅ | ✅ | ✅ |

### N. Settings

| Permission | Kode | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|---|
| View Settings | `view-settings` | ✅ | ✅ | ❌ | ❌ |
| Edit Company Profile | `edit-company-profile` | ✅ | ✅ | ❌ | ❌ |
| Edit Application Settings | `edit-app-settings` | ✅ | ❌ | ❌ | ❌ |

---

## 2.4 Matriks Permission per Role (Ringkasan)

| Modul | Super Admin | Owner | Manager | Staff |
|---|---|---|---|---|
| **Authentication** | Full | Full | Full | Full |
| **User Management** | Full | View Only | View Only | None |
| **Dashboard** | Full | Full | Full | Full |
| **Product** | Full | Full | Full | View, Create |
| **Inventory** | Full | Full | Full | View, Stock In/Out |
| **Supplier** | Full | Full | Full | View, Create |
| **Customer** | Full | Full | Full | View, Create |
| **Purchase** | Full | Full | Full | View, Create |
| **Sales** | Full | Full | Full | View, Create |
| **Expense** | Full | Full | Full | View, Create |
| **Reports** | Full | Full | Full | None |
| **Activity Logs** | Full | Full | View Logs | None |
| **Notifications** | Full | Full | Full | Full |
| **Settings** | Full | Limited | None | None |

---

## 2.5 Database Seed Strategy

```php
// Roles
Role::create(['name' => 'super_admin', 'guard_name' => 'web']);
Role::create(['name' => 'owner',       'guard_name' => 'web']);
Role::create(['name' => 'manager',     'guard_name' => 'web']);
Role::create(['name' => 'staff',       'guard_name' => 'web']);

// Super Admin gets ALL permissions
$superAdmin->givePermissionTo(Permission::all());

// Owner gets business permissions
$owner->givePermissionTo([...businessPermissions]);

// Manager gets operational permissions
$manager->givePermissionTo([...operationalPermissions]);

// Staff gets basic permissions
$staff->givePermissionTo([...basicPermissions]);
```

---

## 2.6 Permission Validation Rules

1. **Hirarki Otomatis**: Staff tidak bisa memiliki permission yang hanya dimiliki Manager+.
2. **No Permission Escalation**: User tidak bisa memberikan permission yang ia sendiri tidak miliki.
3. **Immutable Super Admin**: Role Super Admin tidak bisa dihapus atau diubah permission-nya.
4. **Audit Trail**: Setiap perubahan role/permission dicatat di activity logs.
5. **Default Deny**: Jika tidak ada permission yang diberikan, akses otomatis ditolak.

---

--- _End of Phase 2 — Role & Permission Analysis_ ---
