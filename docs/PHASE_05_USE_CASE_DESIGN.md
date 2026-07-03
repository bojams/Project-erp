# PHASE 5: USE CASE DESIGN — Hideo ERP

---

## 5.1 Actors

| Actor ID | Actor Name | Description |
|---|---|---|
| ACT-01 | **Super Admin** | Administrator sistem dengan akses penuh ke seluruh fitur termasuk konfigurasi teknis |
| ACT-02 | **Owner** | Pemilik bisnis, fokus pada laporan dan pengaturan perusahaan |
| ACT-03 | **Manager** | Manager operasional, mengelola staff dan menyetujui transaksi |
| ACT-04 | **Staff** | Staff operasional, melaksanakan tugas harian (gudang, kasir, pembelian) |
| ACT-05 | **System** | Sistem itu sendiri — menjalankan proses otomatis (notifikasi, log, dll) |
| ACT-06 | **Email Server** | Server email untuk pengiriman reset password |

### Actor Hierarchy

```
                    ┌─────────────────────────────────────────────┐
                    │              ACT-01: SUPER ADMIN            │
                    │         (Inherits all actor abilities)       │
                    └──────────────────────┬──────────────────────┘
                                           │
                    ┌──────────────────────▼──────────────────────┐
                    │              ACT-02: OWNER                   │
                    │       (Inherits Manager + Staff abilities)   │
                    └──────────────────────┬──────────────────────┘
                                           │
                    ┌──────────────────────▼──────────────────────┐
                    │              ACT-03: MANAGER                 │
                    │        (Inherits Staff abilities)            │
                    └──────────────────────┬──────────────────────┘
                                           │
                    ┌──────────────────────▼──────────────────────┐
                    │              ACT-04: STAFF                   │
                    │         (Base-level operational actor)       │
                    └─────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────────┐
                    │   ACT-05: SYSTEM (Automated Processes)       │
                    └─────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────────┐
                    │   ACT-06: EMAIL SERVER (External System)     │
                    └─────────────────────────────────────────────┘
```

---

## 5.2 Use Case Diagram (Textual)

### Authentication Module

```
┌────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-01: Login                                                  │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: User memasukkan email dan password untuk login   │
│  Precondition: User memiliki akun aktif                         │
│  Postcondition: User mendapatkan token akses (Sanctum)          │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-02: Logout                                                 │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: User logout, token di-revoke                     │
│  Postcondition: Token tidak valid lagi                          │
│                                                                │
│  UC-03: Forgot Password                                        │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: User meminta link reset password via email        │
│  Extends: UC-01 (Login) — if password forgotten                │
│  Uses: ACT-06 (Email Server)                                   │
│                                                                │
│  UC-04: Reset Password                                         │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: User set password baru dengan token valid        │
│  Precondition: Token reset password valid dan belum expired    │
│                                                                │
│  UC-05: View Profile                                           │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: User melihat informasi profil sendiri            │
│                                                                │
│  UC-06: Edit Profile                                           │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: User mengupdate nama dan foto profil             │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-07: Change Password                                        │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: User mengganti password dengan verifikasi lama  │
│  Postcondition: Password baru terhash, session token baru      │
│  Includes: UC-10 (Log Activity)                                 │
└────────────────────────────────────────────────────────────────┘
```

### User Management Module

```
┌────────────────────────────────────────────────────────────────┐
│                   USER MANAGEMENT                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-08: List Users                                             │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Menampilkan daftar user dengan search/filter     │
│                                                                │
│  UC-09: Create User                                            │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01                                                 │
│  Description: Membuat user baru dengan role assignment          │
│  Postcondition: User baru terdaftar, email notifikasi opsional │
│  Includes: UC-10 (Log Activity)                                 │
│  Validation: Email unique, password min 8 chars                │
│                                                                │
│  UC-10: (Extends) Log Activity                                 │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-05 (System)                                        │
│  Description: Mencatat aktivitas user ke activity logs         │
│                                                                │
│  UC-11: Edit User                                              │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01                                                 │
│  Description: Mengupdate data user (name, email, role, status) │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-12: Delete User                                            │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01                                                 │
│  Description: Soft delete user (tidak bisa hapus diri sendiri) │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-13: List Roles                                             │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02                                        │
│  Description: Menampilkan daftar role dengan permission-nya    │
│                                                                │
│  UC-14: Create Role                                            │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01                                                 │
│  Description: Membuat role baru dengan permission assignment   │
│  Includes: UC-10 (Log Activity)                                 │
│  Validation: Role name unique                                   │
│                                                                │
│  UC-15: Edit Role                                              │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01                                                 │
│  Description: Mengupdate permission pada role                  │
│  Includes: UC-10 (Log Activity)                                 │
│  Constraint: Super Admin role tidak bisa diedit                │
│                                                                │
│  UC-16: Delete Role                                            │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01                                                 │
│  Description: Menghapus role (validasi tidak ada user aktif)   │
│  Includes: UC-10 (Log Activity)                                 │
│  Constraint: Super Admin role tidak bisa dihapus               │
│                                                                │
│  UC-17: List Permissions                                       │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02                                        │
│  Description: Menampilkan daftar semua permission di sistem    │
└────────────────────────────────────────────────────────────────┘
```

### Dashboard Module

```
┌────────────────────────────────────────────────────────────────┐
│                      DASHBOARD                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-18: View Dashboard                                         │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Menampilkan halaman dashboard dengan:            │
│    - Revenue overview (card + chart)                           │
│    - Expense overview (card)                                   │
│    - Recent activity (timeline)                                │
│    - Low stock alerts                                          │
│    - Quick statistics (total products, customers, suppliers)   │
│  Includes: UC-19 (Get Dashboard Data) — system fetches data   │
│  Note: Staff hanya melihat data yang relevan dengan role       │
│                                                                │
│  UC-19: Get Dashboard Data                                     │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-05 (System)                                        │
│  Description: Mengaggregasi data dari berbagai modul untuk     │
│    ditampilkan di dashboard                                    │
│  Data sources: Sales, Purchases, Products, Expenses, Logs      │
└────────────────────────────────────────────────────────────────┘
```

### Product Management Module

```
┌────────────────────────────────────────────────────────────────┐
│                   PRODUCT MANAGEMENT                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-20: List Products                                          │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Menampilkan daftar produk dengan search,         │
│    filter kategori, sort, pagination                           │
│                                                                │
│  UC-21: Create Product                                         │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Membuat produk baru dengan SKU auto-generate     │
│  Includes: UC-10 (Log Activity)                                 │
│  Validation: SKU unique, nama required, harga jual >= beli     │
│                                                                │
│  UC-22: Edit Product                                           │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Mengupdate data produk                           │
│  Includes: UC-10 (Log Activity)                                 │
│  Validation: SKU tidak boleh duplikat (kecuali milik sendiri) │
│                                                                │
│  UC-23: Delete Product                                         │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Soft delete produk                               │
│  Includes: UC-10 (Log Activity)                                 │
│  Constraint: Tidak bisa delete jika sudah ada transaksi        │
│                                                                │
│  UC-24: Manage Categories                                      │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04 (view only for Staff)  │
│  Description: CRUD kategori produk                             │
│  Includes: UC-10 (Log Activity) — for create/edit/delete       │
│                                                                │
│  UC-25: Manage Units                                           │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04 (view only for Staff)  │
│  Description: CRUD satuan produk (pcs, kg, box, dll)           │
│  Includes: UC-10 (Log Activity) — for create/edit/delete       │
│                                                                │
│  UC-26: View Product Detail                                    │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Detail produk + stock history                    │
│  Includes: UC-43 (View Stock History)                          │
└────────────────────────────────────────────────────────────────┘
```

### Inventory Management Module

```
┌────────────────────────────────────────────────────────────────┐
│                   INVENTORY MANAGEMENT                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-27: Stock In                                               │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Mencatat penerimaan barang ke gudang             │
│    - Bisa dari Purchase Order reference atau direct stock in   │
│  Postcondition: Stok produk bertambah, stock history tercatat  │
│  Includes: UC-10 (Log Activity), UC-44 (Update Stock)          │
│  Validation: Qty > 0, produk exist                             │
│                                                                │
│  UC-28: Stock Out                                              │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Mencatat pengeluaran barang dari gudang          │
│    - Bisa dari Sales Order reference atau direct stock out     │
│  Postcondition: Stok produk berkurang, stock history tercatat  │
│  Includes: UC-10 (Log Activity), UC-44 (Update Stock)          │
│  Validation: Qty > 0, stok cukup                               │
│                                                                │
│  UC-29: Stock Adjustment                                       │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Penyesuaian stok (+/-) karena selisih fisik      │
│  Postcondition: Stok disesuaikan, history tercatat dengan      │
│    alasan penyesuaian                                          │
│  Includes: UC-10 (Log Activity), UC-44 (Update Stock)          │
│  Validation: Qty != 0, reason required                         │
│                                                                │
│  UC-30: View Stock List                                        │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Melihat stok semua produk secara real-time       │
│    dengan stok minimal sebagai acuan                           │
│                                                                │
│  UC-31: View Stock History                                     │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Riwayat perubahan stok untuk produk tertentu     │
│    Menampilkan: tipe, qty, reference, user, timestamp          │
│                                                                │
│  UC-44: Update Stock (Internal)                                │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-05 (System)                                        │
│  Description: Update quantity produk di tabel products         │
│    Dipanggil oleh UC-27, UC-28, UC-29, UC-37, UC-39           │
│  Postcondition: product.stock berubah, stock history tercatat  │
└────────────────────────────────────────────────────────────────┘
```

### Supplier Management Module

```
┌────────────────────────────────────────────────────────────────┐
│                   SUPPLIER MANAGEMENT                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-32: List Suppliers                                         │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Menampilkan daftar supplier dengan search/pagi   │
│                                                                │
│  UC-33: Create Supplier                                        │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Membuat supplier baru                            │
│  Includes: UC-10 (Log Activity)                                 │
│  Validation: Nama required, phone/email at least one           │
│                                                                │
│  UC-34: Edit Supplier                                          │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Mengupdate data supplier                         │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-35: Delete Supplier                                        │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Soft delete supplier                             │
│  Includes: UC-10 (Log Activity)                                 │
│  Constraint: Validasi jika sudah ada transaksi pembelian       │
└────────────────────────────────────────────────────────────────┘
```

### Customer Management Module

```
┌────────────────────────────────────────────────────────────────┐
│                   CUSTOMER MANAGEMENT                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-36: List Customers                                         │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Menampilkan daftar customer dengan search/pagi   │
│                                                                │
│  UC-37: Create Customer                                        │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Membuat customer baru                            │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-38: Edit Customer                                          │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Mengupdate data customer                         │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-39: Delete Customer                                        │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Soft delete customer                             │
│  Includes: UC-10 (Log Activity)                                 │
│  Constraint: Validasi jika sudah ada transaksi penjualan       │
└────────────────────────────────────────────────────────────────┘
```

### Purchase Management Module

```
┌────────────────────────────────────────────────────────────────┐
│                   PURCHASE MANAGEMENT                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-40: List Purchase Orders                                   │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Menampilkan daftar PO dengan filter status,       │
│    date range, search, pagination                               │
│                                                                │
│  UC-41: Create Purchase Order                                  │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Membuat PO baru dengan items produk              │
│    - Pilih supplier                                             │
│    - Pilih produk + qty + harga beli                           │
│    - Auto calculate total                                      │
│  Postcondition: PO terbuat dengan status "pending"              │
│  Includes: UC-10 (Log Activity)                                 │
│  Validation: Minimal 1 item, supplier required                 │
│                                                                │
│  UC-42: Edit Purchase Order                                    │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Edit PO (hanya jika status pending)              │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-43: Delete Purchase Order                                  │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Hapus PO (hanya jika status pending)             │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-44: Approve Purchase Order                                 │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Approve PO, ubah status pending → approved       │
│  Postcondition: Status PO = approved, item siap diterima       │
│  Includes: UC-10 (Log Activity)                                 │
│  Constraint: Cannot self-approve (creator cannot approve)     │
│                                                                │
│  UC-45: Receive Purchase Order                                 │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Konfirmasi penerimaan barang dari PO             │
│    - Bisa receive partial atau full                            │
│  Postcondition: Status PO = received, auto Stock In, stok +    │
│  Includes: UC-27 (Stock In), UC-10 (Log Activity)              │
│                                                                │
│  UC-46: View Purchase Detail                                   │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Detail PO + items + status timeline               │
└────────────────────────────────────────────────────────────────┘
```

### Sales Management Module

```
┌────────────────────────────────────────────────────────────────┐
│                    SALES MANAGEMENT                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-47: List Sales Orders                                      │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Menampilkan daftar SO dengan filter status,       │
│    payment status, date range, pagination                       │
│                                                                │
│  UC-48: Create Sales Order                                     │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Membuat SO baru dengan items produk              │
│    - Pilih customer (optional — bisa walk-in)                  │
│    - Pilih produk + qty                                        │
│    - Auto calculate total                                      │
│  Postcondition: SO terbuat, stok berkurang, history tercatat   │
│  Includes: UC-28 (Stock Out), UC-10 (Log Activity)             │
│  Validation: Stok cukup untuk semua item                       │
│                                                                │
│  UC-49: Edit Sales Order                                       │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Edit SO (hanya jika status pending)              │
│  Includes: UC-10 (Log Activity)                                 │
│  Note: If items changed, re-validate stock and revert old stock │
│                                                                │
│  UC-50: Delete Sales Order                                     │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Hapus SO (hanya jika status pending)             │
│  Includes: UC-10 (Log Activity)                                 │
│  Postcondition: Stok dikembalikan (revert stock out)           │
│                                                                │
│  UC-51: View Invoice                                           │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Melihat invoice dalam format print-friendly       │
│                                                                │
│  UC-52: Update Payment Status                                  │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Update status payment: unpaid → partial → paid   │
│    - Input jumlah yang dibayar (untuk partial)                 │
│  Includes: UC-10 (Log Activity)                                 │
│  Validation: Amount paid <= total                              │
│                                                                │
│  UC-53: View Sales Detail                                      │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Detail SO + items + payment status + timeline    │
└────────────────────────────────────────────────────────────────┘
```

### Expense Management Module

```
┌────────────────────────────────────────────────────────────────┐
│                   EXPENSE MANAGEMENT                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-54: List Expenses                                          │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Menampilkan daftar expense dengan filter kategori│
│    date range, search, pagination                               │
│                                                                │
│  UC-55: Create Expense                                         │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Mencatat pengeluaran baru                        │
│    - Deskripsi, jumlah, kategori, tanggal, bukti (optional)    │
│  Includes: UC-10 (Log Activity)                                 │
│  Validation: Amount > 0, kategori required                     │
│                                                                │
│  UC-56: Edit Expense                                           │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Mengupdate data expense                          │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-57: Delete Expense                                         │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Menghapus expense                                │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-58: Manage Expense Categories                              │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: CRUD kategori expense                            │
│  Includes: UC-10 (Log Activity) — for create/edit/delete       │
└────────────────────────────────────────────────────────────────┘
```

### Reports Module

```
┌────────────────────────────────────────────────────────────────┐
│                       REPORTS                                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-59: View Sales Report                                      │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Laporan penjualan dengan filter date range       │
│    - Total penjualan, jumlah transaksi, rata-rata transaksi    │
│    - Detail per transaksi                                      │
│    - Bar chart (opsional)                                      │
│  Extends: UC-63 (Export Report)                                │
│                                                                │
│  UC-60: View Purchase Report                                   │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Laporan pembelian dengan filter date range       │
│    - Total pembelian, jumlah PO, rata-rata per PO              │
│    - Detail per PO                                             │
│  Extends: UC-63 (Export Report)                                │
│                                                                │
│  UC-61: View Inventory Report                                  │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Laporan stok dengan filter kategori              │
│    - Stok saat ini, nilai stok, low stock items                │
│    - Detail per produk                                         │
│  Extends: UC-63 (Export Report)                                │
│                                                                │
│  UC-62: View Expense Report                                    │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Laporan pengeluaran dengan filter date range     │
│    - Total pengeluaran, per kategori, per periode              │
│    - Pie chart per kategori (opsional)                         │
│  Extends: UC-63 (Export Report)                                │
│                                                                │
│  UC-63: Export Report                                          │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Export laporan ke PDF atau Excel                 │
│  Postcondition: File siap di-download                          │
└────────────────────────────────────────────────────────────────┘
```

### Activity Logs Module

```
┌────────────────────────────────────────────────────────────────┐
│                      ACTIVITY LOGS                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-64: View Login Logs                                        │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02                                        │
│  Description: Menampilkan log login user                       │
│    - Filter by user, date range, success/failed                │
│                                                                │
│  UC-65: View Activity Logs                                     │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03                                │
│  Description: Menampilkan aktivitas user                       │
│    - Filter by user, action (create/update/delete), module     │
│    - Menampilkan detail perubahan                             │
└────────────────────────────────────────────────────────────────┘
```

### Notifications Module

```
┌────────────────────────────────────────────────────────────────┐
│                     NOTIFICATIONS                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-66: View Notifications                                     │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Menampilkan daftar notifikasi (bell icon)        │
│    - Unread count badge                                        │
│    - Dropdown preview (5 latest)                               │
│    - Full page list                                            │
│                                                                │
│  UC-67: Mark Notification Read                                 │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02, ACT-03, ACT-04                        │
│  Description: Tandai notifikasi sudah dibaca (single / all)    │
│                                                                │
│  UC-68: Auto Generate Notification                             │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-05 (System)                                        │
│  Description: Sistem auto generate notifikasi saat:            │
│    - Stok produk di bawah minimal                              │
│    - PO perlu approval                                        │
│  Includes: UC-10 (Log Activity)                                 │
└────────────────────────────────────────────────────────────────┘
```

### Settings Module

```
┌────────────────────────────────────────────────────────────────┐
│                       SETTINGS                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  UC-69: Edit Company Profile                                   │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01, ACT-02                                        │
│  Description: Mengupdate profil perusahaan (nama, alamat,      │
│    telepon, email, logo)                                       │
│  Includes: UC-10 (Log Activity)                                 │
│                                                                │
│  UC-70: Edit Application Settings                              │
│  ──────────────────────────────────────────────────────────────│
│  Actor: ACT-01                                                 │
│  Description: Mengatur konfigurasi aplikasi                    │
│    - Currency, timezone, date format                           │
│    - Low stock threshold default                                │
│  Includes: UC-10 (Log Activity)                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 5.3 Use Case Summary

| No | UC ID | Use Case Name | Primary Actor | Priority |
|---|---|---|---|---|
| 1 | UC-01 | Login | All Users | P0 |
| 2 | UC-02 | Logout | All Users | P0 |
| 3 | UC-03 | Forgot Password | All Users | P0 |
| 4 | UC-04 | Reset Password | All Users | P0 |
| 5 | UC-05 | View Profile | All Users | P1 |
| 6 | UC-06 | Edit Profile | All Users | P1 |
| 7 | UC-07 | Change Password | All Users | P1 |
| 8 | UC-08 | List Users | Super Admin, Owner, Manager | P0 |
| 9 | UC-09 | Create User | Super Admin | P0 |
| 10 | UC-10 | Log Activity | System | P1 |
| 11 | UC-11 | Edit User | Super Admin | P0 |
| 12 | UC-12 | Delete User | Super Admin | P1 |
| 13 | UC-13 | List Roles | Super Admin, Owner | P0 |
| 14 | UC-14 | Create Role | Super Admin | P0 |
| 15 | UC-15 | Edit Role | Super Admin | P0 |
| 16 | UC-16 | Delete Role | Super Admin | P1 |
| 17 | UC-17 | List Permissions | Super Admin, Owner | P1 |
| 18 | UC-18 | View Dashboard | All Users | P0 |
| 19 | UC-19 | Get Dashboard Data | System | P0 |
| 20 | UC-20 | List Products | All Users | P0 |
| 21 | UC-21 | Create Product | All Users (Staff+) | P0 |
| 22 | UC-22 | Edit Product | Super Admin, Owner, Manager | P0 |
| 23 | UC-23 | Delete Product | Super Admin, Owner, Manager | P1 |
| 24 | UC-24 | Manage Categories | All Users (varying access) | P1 |
| 25 | UC-25 | Manage Units | All Users (varying access) | P1 |
| 26 | UC-26 | View Product Detail | All Users | P2 |
| 27 | UC-27 | Stock In | All Users | P0 |
| 28 | UC-28 | Stock Out | All Users | P0 |
| 29 | UC-29 | Stock Adjustment | Super Admin, Owner, Manager | P1 |
| 30 | UC-30 | View Stock List | All Users | P0 |
| 31 | UC-31 | View Stock History | All Users | P1 |
| 32 | UC-32 | List Suppliers | All Users | P0 |
| 33 | UC-33 | Create Supplier | All Users (Staff+) | P0 |
| 34 | UC-34 | Edit Supplier | Super Admin, Owner, Manager | P1 |
| 35 | UC-35 | Delete Supplier | Super Admin, Owner, Manager | P1 |
| 36 | UC-36 | List Customers | All Users | P0 |
| 37 | UC-37 | Create Customer | All Users (Staff+) | P0 |
| 38 | UC-38 | Edit Customer | Super Admin, Owner, Manager | P1 |
| 39 | UC-39 | Delete Customer | Super Admin, Owner, Manager | P1 |
| 40 | UC-40 | List Purchase Orders | All Users | P0 |
| 41 | UC-41 | Create Purchase Order | All Users (Staff+) | P0 |
| 42 | UC-42 | Edit Purchase Order | Super Admin, Owner, Manager | P1 |
| 43 | UC-43 | Delete Purchase Order | Super Admin, Owner, Manager | P1 |
| 44 | UC-44 | Approve Purchase Order | Super Admin, Owner, Manager | P1 |
| 45 | UC-45 | Receive Purchase Order | Super Admin, Owner, Manager | P1 |
| 46 | UC-46 | View Purchase Detail | All Users | P1 |
| 47 | UC-47 | List Sales Orders | All Users | P0 |
| 48 | UC-48 | Create Sales Order | All Users (Staff+) | P0 |
| 49 | UC-49 | Edit Sales Order | Super Admin, Owner, Manager | P1 |
| 50 | UC-50 | Delete Sales Order | Super Admin, Owner, Manager | P1 |
| 51 | UC-51 | View Invoice | All Users | P1 |
| 52 | UC-52 | Update Payment Status | Super Admin, Owner, Manager | P1 |
| 53 | UC-53 | View Sales Detail | All Users | P1 |
| 54 | UC-54 | List Expenses | All Users | P0 |
| 55 | UC-55 | Create Expense | All Users (Staff+) | P0 |
| 56 | UC-56 | Edit Expense | Super Admin, Owner, Manager | P1 |
| 57 | UC-57 | Delete Expense | Super Admin, Owner, Manager | P1 |
| 58 | UC-58 | Manage Expense Categories | Super Admin, Owner, Manager | P1 |
| 59 | UC-59 | View Sales Report | Super Admin, Owner, Manager | P1 |
| 60 | UC-60 | View Purchase Report | Super Admin, Owner, Manager | P1 |
| 61 | UC-61 | View Inventory Report | Super Admin, Owner, Manager | P1 |
| 62 | UC-62 | View Expense Report | Super Admin, Owner, Manager | P1 |
| 63 | UC-63 | Export Report | Super Admin, Owner, Manager | P2 |
| 64 | UC-64 | View Login Logs | Super Admin, Owner | P1 |
| 65 | UC-65 | View Activity Logs | Super Admin, Owner, Manager | P1 |
| 66 | UC-66 | View Notifications | All Users | P1 |
| 67 | UC-67 | Mark Notification Read | All Users | P1 |
| 68 | UC-68 | Auto Generate Notification | System | P1 |
| 69 | UC-69 | Edit Company Profile | Super Admin, Owner | P1 |
| 70 | UC-70 | Edit Application Settings | Super Admin | P1 |

---

## 5.4 Use Case Relationships

```
UC-01 (Login) ─────────────> UC-10 (Log Activity)   [include]
UC-03 (Forgot Password) ───> UC-01 (Login)           [extend]
UC-06 (Edit Profile) ──────> UC-10 (Log Activity)    [include]
UC-07 (Change Password) ───> UC-10 (Log Activity)    [include]
UC-09 (Create User) ───────> UC-10 (Log Activity)    [include]
UC-11 (Edit User) ─────────> UC-10 (Log Activity)    [include]
UC-12 (Delete User) ───────> UC-10 (Log Activity)    [include]
UC-14 (Create Role) ───────> UC-10 (Log Activity)    [include]
UC-15 (Edit Role) ─────────> UC-10 (Log Activity)    [include]
UC-16 (Delete Role) ───────> UC-10 (Log Activity)    [include]
UC-18 (View Dashboard) ────> UC-19 (Get Dashboard)   [include]
UC-21 (Create Product) ────> UC-10 (Log Activity)    [include]
UC-22 (Edit Product) ──────> UC-10 (Log Activity)    [include]
UC-23 (Delete Product) ────> UC-10 (Log Activity)    [include]
UC-26 (View Product Detail) > UC-31 (View Stock Hist) [include]
UC-27 (Stock In) ──────────> UC-10, UC-44 (Update)   [include]
UC-28 (Stock Out) ─────────> UC-10, UC-44 (Update)   [include]
UC-29 (Stock Adjustment) ──> UC-10, UC-44 (Update)   [include]
UC-41 (Create PO) ─────────> UC-10 (Log Activity)    [include]
UC-42 (Edit PO) ───────────> UC-10 (Log Activity)    [include]
UC-43 (Delete PO) ─────────> UC-10 (Log Activity)    [include]
UC-44 (Approve PO) ────────> UC-10 (Log Activity)    [include]
UC-45 (Receive PO) ────────> UC-27 (Stock In)        [include]
UC-48 (Create SO) ─────────> UC-28 (Stock Out)       [include]
UC-48 (Create SO) ─────────> UC-10 (Log Activity)    [include]
UC-52 (Update Payment) ────> UC-10 (Log Activity)    [include]
UC-59 (Sales Report) ──────> UC-63 (Export)          [extend]
UC-60 (Purchase Report) ───> UC-63 (Export)          [extend]
UC-61 (Inventory Report) ──> UC-63 (Export)          [extend]
UC-62 (Expense Report) ────> UC-63 (Export)          [extend]
```

---

--- _End of Phase 5 — Use Case Design_ ---
