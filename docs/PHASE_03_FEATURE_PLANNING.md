# PHASE 3: FEATURE PLANNING — Hideo ERP

---

## 3.1 Modul & Fitur Lengkap

### Module A: Authentication
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| A-01 | Login | Autentikasi menggunakan email & password, token-based (Sanctum) | P0 - Critical |
| A-02 | Logout | Revoke token, hapus session | P0 - Critical |
| A-03 | Forgot Password | Kirim link reset password via email | P0 - Critical |
| A-04 | Reset Password | Set password baru dengan token validasi | P0 - Critical |
| A-05 | Profile View | Lihat profil sendiri (nama, email, foto) | P1 - High |
| A-06 | Profile Edit | Update profil (nama, foto) | P1 - High |
| A-07 | Change Password | Ganti password sendiri (dengan verifikasi password lama) | P1 - High |

### Module B: User Management
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| B-01 | User List | Tabel daftar user dengan search, sort, filter, pagination | P0 - Critical |
| B-02 | Create User | Form create user (name, email, password, role) | P0 - Critical |
| B-03 | Edit User | Form edit user (name, email, role, active status) | P0 - Critical |
| B-04 | Delete User | Soft delete user | P1 - High |
| B-05 | User Detail | Detail informasi user + role + last login | P2 - Medium |
| B-06 | Role List | Tabel daftar role | P0 - Critical |
| B-07 | Create Role | Form create role dengan permission checkboxes | P0 - Critical |
| B-08 | Edit Role | Form edit role dengan permission checkboxes | P0 - Critical |
| B-09 | Delete Role | Hapus role (validasi tidak ada user yang menggunakan) | P1 - High |
| B-10 | Permission List | Tabel daftar permission (read-only untuk non-SA) | P1 - High |

### Module C: Dashboard
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| C-01 | Revenue Overview | Card + chart revenue hari/minggu/bulan | P0 - Critical |
| C-02 | Expense Overview | Card + chart pengeluaran periode | P1 - High |
| C-03 | Recent Activity | Timeline 10 aktivitas terbaru | P0 - Critical |
| C-04 | Low Stock Alert | Card daftar produk dengan stok di bawah minimal | P0 - Critical |
| C-05 | Quick Statistics | Total produk, pelanggan, supplier, transaksi hari ini | P1 - High |
| C-06 | Sales Chart | Grafik penjualan 7 hari / 30 hari | P2 - Medium |
| C-07 | Top Products | Produk terlaris periode ini | P2 - Medium |

### Module D: Product Management
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| D-01 | Product List | Tabel produk dengan search, sort, filter kategori, pagination | P0 - Critical |
| D-02 | Create Product | Form create (name, SKU, category, unit, price, stock, image) | P0 - Critical |
| D-03 | Edit Product | Form edit produk | P0 - Critical |
| D-04 | Delete Product | Soft delete produk (validasi jika sudah bertransaksi) | P1 - High |
| D-05 | Product Detail | Detail produk + stok history + harga | P2 - Medium |
| D-06 | Barcode Generator | Generate & print barcode produk | P2 - Medium |
| D-07 | Product Image | Upload & crop image produk | P2 - Medium |
| D-08 | Category List | Manajemen kategori produk | P1 - High |
| D-09 | Unit List | Manajemen satuan produk (pcs, kg, box, lusin, dll) | P1 - High |
| D-10 | Import Products | Import via CSV/Excel | P3 - Nice |
| D-11 | Export Products | Export ke CSV/Excel | P2 - Medium |

### Module E: Inventory Management
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| E-01 | Stock List | Tabel stok semua produk (real-time) | P0 - Critical |
| E-02 | Stock In | Form penerimaan barang (purchase reference optional) | P0 - Critical |
| E-03 | Stock Out | Form pengeluaran barang (sales reference optional) | P0 - Critical |
| E-04 | Stock Adjustment | Form penyesuaian stok (+/-) dengan alasan | P1 - High |
| E-05 | Stock History | Riwayat perubahan stok per produk | P1 - High |
| E-06 | Low Stock Report | Filter produk dengan stok menipis | P2 - Medium |
| E-07 | Stock Mutation | Mutasi stok antar gudang (jika multi-warehouse) | P3 - Nice |

### Module F: Supplier Management
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-01 | Supplier List | Tabel supplier dengan search, sort, pagination | P0 - Critical |
| F-02 | Create Supplier | Form create (name, contact, phone, email, address, NPWP) | P0 - Critical |
| F-03 | Edit Supplier | Form edit supplier | P1 - High |
| F-04 | Delete Supplier | Soft delete (validasi jika sudah ada transaksi pembelian) | P1 - High |
| F-05 | Supplier Detail | Detail supplier + riwayat pembelian | P2 - Medium |

### Module G: Customer Management
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| G-01 | Customer List | Tabel customer dengan search, sort, pagination | P0 - Critical |
| G-02 | Create Customer | Form create (name, contact, phone, email, address) | P0 - Critical |
| G-03 | Edit Customer | Form edit customer | P1 - High |
| G-04 | Delete Customer | Soft delete (validasi jika sudah ada transaksi penjualan) | P1 - High |
| G-05 | Customer Detail | Detail customer + riwayat pembelian + status piutang | P2 - Medium |

### Module H: Purchase Management
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| H-01 | Purchase List | Tabel purchase order dengan search, sort, filter status, pagination | P0 - Critical |
| H-02 | Create Purchase | Form create PO (pilih supplier, pilih produk, qty, price) | P0 - Critical |
| H-03 | Purchase Detail | Detail PO + status + timeline | P1 - High |
| H-04 | Edit Purchase | Edit PO (hanya jika status pending) | P1 - High |
| H-05 | Delete Purchase | Hapus PO (hanya jika status pending) | P1 - High |
| H-06 | Approve Purchase | Approve / reject PO | P1 - High |
| H-07 | Receive Purchase | Konfirmasi penerimaan barang dari PO → auto stock in | P1 - High |
| H-08 | Purchase Invoice | Upload invoice pembelian | P3 - Nice |

### Module I: Sales Management
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| I-01 | Sales List | Tabel sales order dengan search, sort, filter status, pagination | P0 - Critical |
| I-02 | Create Sales | Form create sales (pilih customer, pilih produk, qty) | P0 - Critical |
| I-03 | Sales Detail | Detail SO + items + total | P1 - High |
| I-04 | Edit Sales | Edit SO (hanya jika status pending) | P1 - High |
| I-05 | Delete Sales | Hapus SO (hanya jika status pending) | P1 - High |
| I-06 | Invoice View | Lihat invoice (print-friendly) | P1 - High |
| I-07 | Update Payment | Update status payment (unpaid → partial → paid) | P1 - High |
| I-08 | Sales Return | Retur penjualan (barang dikembalikan, stok dikembalikan) | P3 - Nice |

### Module J: Expense Management
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| J-01 | Expense List | Tabel expense dengan search, sort, filter kategori, pagination | P0 - Critical |
| J-02 | Create Expense | Form create (description, amount, category, date, receipt) | P0 - Critical |
| J-03 | Edit Expense | Edit expense | P1 - High |
| J-04 | Delete Expense | Hapus expense | P1 - High |
| J-05 | Expense Category | Manajemen kategori pengeluaran | P1 - High |

### Module K: Reports
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| K-01 | Sales Report | Laporan penjualan (filter: date range, status) — tabel + chart | P1 - High |
| K-02 | Purchase Report | Laporan pembelian (filter: date range, status) — tabel + chart | P1 - High |
| K-03 | Inventory Report | Laporan stok (filter: kategori, low stock) — tabel | P1 - High |
| K-04 | Expense Report | Laporan pengeluaran (filter: date range, kategori) — tabel + chart | P1 - High |
| K-05 | Profit & Loss | Laporan laba rugi sederhana | P2 - Medium |
| K-06 | Export PDF | Export laporan ke PDF | P2 - Medium |
| K-07 | Export Excel | Export laporan ke Excel | P2 - Medium |

### Module L: Activity Logs
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| L-01 | Login Logs | Log login user (timestamp, IP, user agent) | P1 - High |
| L-02 | Activity Logs | Log aktivitas user (create, update, delete) dengan detail | P1 - High |
| L-03 | Log Filter | Filter logs by user, action, date range | P2 - Medium |

### Module M: Notification System
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| M-01 | In-App Notification | Notifikasi di dalam aplikasi (bell icon) | P1 - High |
| M-02 | Low Stock Notification | Notifikasi otomatis saat stok di bawah minimal | P1 - High |
| M-03 | PO Approval Notification | Notifikasi untuk approval PO | P2 - Medium |
| M-04 | Mark as Read | Tandai notifikasi sudah dibaca | P1 - High |
| M-05 | Mark All Read | Tandai semua notifikasi sudah dibaca | P2 - Medium |

### Module N: Settings
| No | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| N-01 | Company Profile | Edit nama perusahaan, alamat, telepon, email, logo | P1 - High |
| N-02 | App Settings | Currency, timezone, date format, low stock threshold | P1 - High |
| N-03 | Tax Settings | PPN, PPh settings | P3 - Nice |

---

## 3.2 Feature Priority Matrix

```
P0 - Critical (Must Have)  → 18 fitur
P1 - High (Should Have)    → 28 fitur
P2 - Medium (Nice to Have) → 12 fitur
P3 - Nice (Future)         → 4  fitur

Total: 62 fitur (Phase 1: P0 + P1 = 46 fitur)
```

### P0 Features (Must Have — MVP)
| Modul | Fitur |
|---|---|
| Authentication | Login, Logout, Forgot Password, Reset Password |
| User Management | User List, Create/Edit User, Role List, Create/Edit Role |
| Dashboard | Revenue Overview, Recent Activity, Low Stock Alert |
| Product | List, Create, Edit |
| Inventory | Stock List, Stock In, Stock Out |
| Supplier | List, Create |
| Customer | List, Create |
| Purchase | List, Create |
| Sales | List, Create |
| Expense | List, Create |

### P1 Features (Should Have — Sprint 2)
Profile, Delete operations, Categories, Units, Stock Adjustment, Stock History, Edit/Delete/Approve for Purchase & Sales, Invoice, Reports, Activity Logs, Notifications, Settings

### P2 Features (Nice to Have — Sprint 3)
Charts, Detail pages, Barcode, Export, Top Products, Profit & Loss, PDF/Excel export

### P3 Features (Future)
Import Products, Multi-warehouse, Sales Return, Tax Settings

---

## 3.3 Feature Dependencies

```
Authentication ─────────────────────────────────────┐
    │                                                 │
    ├── User Management                               │
    │     └── Role & Permission                       │
    │                                                 │
    ├── Dashboard (requires all transaction data)     │
    │                                                 │
    ├── Product Management ──────────────────────┐    │
    │     ├── Category                            │    │
    │     ├── Unit                                │    │
    │     └── Barcode                             │    │
    │                                              │    │
    ├── Supplier Management ─────────────────┐    │    │
    │                                          │    │    │
    ├── Customer Management ────────────┐    │    │    │
    │                                      │    │    │    │
    ├── Purchase Management ───────────┐   │    │    │    │
    │     └── Supplier                          │    │    │    │
    │     └── Product                           │    │    │    │
    │     └── Stock In (on receive)             │    │    │    │
    │                                      │    │    │    │    │
    ├── Sales Management ──────────────┐   │    │    │    │    │
    │     └── Customer                         │    │    │    │    │
    │     └── Product                          │    │    │    │    │
    │     └── Stock Out (on sale)              │    │    │    │    │
    │                                      │    │    │    │    │    │
    ├── Expense Management ─────────────┐   │    │    │    │    │    │
    │     └── Expense Category                  │    │    │    │    │    │
    │                                      │    │    │    │    │    │    │
    ├── Inventory Management ────────────┤   │    │    │    │    │    │
    │     └── Stock In                           │    │    │    │    │    │
    │     └── Stock Out                          │    │    │    │    │    │
    │     └── Stock Adjustment                   │    │    │    │    │    │
    │     └── Stock History                      │    │    │    │    │    │
    │                                      │    │    │    │    │    │    │
    ├── Reports (requires transaction data)      │    │    │    │    │    │
    │                                      │    │    │    │    │    │    │
    ├── Activity Logs ───────────────────┘    │    │    │    │    │    │
    │                                      │    │    │    │    │    │    │
    ├── Notifications ──────────────────┘    │    │    │    │    │    │
    │                                      │    │    │    │    │    │    │
    └── Settings ───────────────────────┘    │    │    │    │    │    │
                                              │    │    │    │    │    │
                                              ▼    ▼    ▼    ▼    ▼    ▼
                                        Product  Supplier Customer Purchase Sales Expense
                                        (master data dependencies)
```

---

## 3.4 Fitur yang Tidak Termasuk (Out of Scope — Phase 1)

| Fitur | Alasan |
|---|---|
| Multi-warehouse | Menambah kompleksitas, UMKM umumnya 1 gudang |
| Multi-currency | UMKM umumnya transaksi dalam Rupiah |
| POS / Kasir Terintegrasi | Bisa jadi modul terpisah di masa depan |
| Manajemen HR / Payroll | Fokus awal pada inventory & keuangan |
| Manajemen Proyek | Tidak relevan untuk mayoritas UMKM |
| E-commerce Integration | Akan dipertimbangkan di versi berikutnya |
| Mobile App (Native) | Web sudah responsif, PWA bisa jadi alternatif |

---

--- _End of Phase 3 — Feature Planning_ ---
