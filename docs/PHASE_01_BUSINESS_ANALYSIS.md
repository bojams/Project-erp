# PHASE 1: BUSINESS ANALYSIS — Hideo ERP

---

## 1.1 Masalah Bisnis yang Diselesaikan

UMKM (Usaha Mikro, Kecil, dan Menengah) di Indonesia menghadapi tantangan signifikan dalam pengelolaan operasional bisnis sehari-hari:

| Masalah | Dampak |
|---|---|
| Pencatatan manual menggunakan spreadsheet atau buku | Rawan human error, data tidak real-time, sulit audit |
| Tidak terintegrasinya data penjualan, pembelian, dan stok | Double entry, inkonsistensi data, keputusan bisnis salah |
| Tidak ada sistem kontrol stok yang memadai | Kehabisan stok (stockout) atau kelebihan stok (overstock) |
| Kesulitan memantau profitabilitas bisnis | Tidak tahu produk mana yang menguntungkan |
| Tidak ada riwayat transaksi yang terpusat | Sulit追踪 piutang, hutang, dan laporan keuangan |
| Pengelolaan hak akses karyawan tidak ada | Data bisa diakses/diubah oleh siapa saja tanpa kontrol |
| Tidak ada sistem notifikasi otomatis | Keterlambatan dalam restock, pembayaran, dll |
| Laporan bisnis dibuat manual dan tidak real-time | Keputusan bisnis lambat dan tidak berbasis data |

**Hideo ERP** hadir sebagai solusi all-in-one yang dirancang khusus untuk kebutuhan UMKM dengan pendekatan enterprise grade namun tetap sederhana dan mudah digunakan.

---

## 1.2 Tujuan Sistem

1. **Sentralisasi Data** — Seluruh data bisnis tersimpan dalam satu sistem terintegrasi dengan database terpusat.
2. **Otomatisasi Proses Bisnis** — Mengurangi pekerjaan manual melalui workflow otomatis (notifikasi stok, generate laporan, dll).
3. **Kontrol Akses Pengguna** — Setiap pengguna memiliki hak akses sesuai peran (RBAC) untuk menjaga keamanan data.
4. **Pelaporan Real-Time** — Laporan penjualan, pembelian, stok, dan keuangan dapat diakses kapan saja secara akurat.
5. **Manajemen Stok yang Akurat** — Tracking stok masuk, keluar, penyesuaian, dan riwayat stok secara lengkap.
6. **Skalabilitas** — Sistem dapat berkembang seiring pertumbuhan bisnis (dari 1 cabang ke banyak cabang).
7. **Keamanan Data** — Enkripsi, autentikasi, otorisasi, dan logging aktivitas untuk menjaga integritas data.
8. **Pengalaman Pengguna yang Baik** — Antarmuka modern, responsif, dan mudah digunakan oleh pengguna non-teknis.

---

## 1.3 Target Pengguna

### Primary Users

| Segmen | Deskripsi |
|---|---|
| **Pemilik UMKM** (Owner) | Pengusaha yang menjalankan bisnis retail, grosir, manufaktur skala kecil, atau jasa. Memiliki 3-50 karyawan. |
| **Manager Operasional** | Mengelola operasi sehari-hari, memantau stok, penjualan, dan karyawan. |
| **Staff Gudang / Inventory** | Mengelola penerimaan dan pengeluaran barang, pengecekan stok fisik. |
| **Staff Penjualan / Kasir** | Melakukan transaksi penjualan, membuat invoice, mengelola pelanggan. |
| **Staff Pembelian** | Melakukan pembelian barang ke supplier, membuat purchase order. |
| **Staff Keuangan** | Mengelola pengeluaran, memantau pembayaran, membuat laporan keuangan. |

### Secondary Users

| Segmen | Deskripsi |
|---|---|
| **Super Admin** | Administrator teknis yang mengelola konfigurasi sistem, user, role, dan permission. |
| **Akuntan Eksternal** | Dapat diberikan akses terbatas untuk laporan keuangan dan audit. |

---

## 1.4 Workflow Bisnis

### Core Workflow: Order-to-Cash

```
Supplier → Purchase Order → Stock In → Inventory → Sales Order → Invoice → Payment → Customer
```

### End-to-End Business Flow

```
                     ┌──────────────────────┐
                     │   SUPPLIER MANAGEMENT │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │   PURCHASE ORDER     │
                     │   (Beli Barang)      │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │   STOCK IN           │
                     │   (Barang Masuk)     │
                     └──────────┬───────────┘
                                │
                                ▼
               ┌─────────────────────────────────┐
               │         INVENTORY               │
               │  ┌──────────┬──────────┬──────┐ │
               │  │ Stock In │ Stock Out│Adjust│ │
               │  └──────────┴──────────┴──────┘ │
               │  ┌────────────────────────────┐ │
               │  │      Stock History         │ │
               │  └────────────────────────────┘ │
               └────────────────┬────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
        ┌──────────────────┐    ┌──────────────────┐
        │  SALES ORDER     │    │  EXPENSE         │
        │  (Jual Barang)   │    │  (Pengeluaran)   │
        └────────┬─────────┘    └────────┬─────────┘
                 │                        │
                 ▼                        ▼
        ┌──────────────────┐    ┌──────────────────┐
        │  INVOICE         │    │  EXPENSE RECORD  │
        │  & PAYMENT       │    │  & CATEGORY      │
        └────────┬─────────┘    └────────┬─────────┘
                 │                        │
                 ▼                        ▼
        ┌──────────────────┐    ┌──────────────────┐
        │  DASHBOARD       │    │  REPORTS          │
        │  & NOTIFICATIONS │    │  (Sales/Stok/Dll) │
        └──────────────────┘    └──────────────────┘
```

### Detailed Workflows

#### Workflow 1: Purchasing Process
```
1. Staff mengidentifikasi kebutuhan stok (manual / low stock alert)
2. Membuat Purchase Order (PO) ke supplier terpilih
3. PO disetujui oleh Manager/Owner (approval flow)
4. Supplier mengirim barang
5. Staff gudang melakukan Stock In (barang + quantity + cek kondisi)
6. Stok otomatis bertambah di sistem
7. Purchase history tercatat
```

#### Workflow 2: Sales Process
```
1. Customer datang / order
2. Staff membuat Sales Order
3. Sistem cek ketersediaan stok
4. Jika stok cukup → lanjut
5. Staff membuat Invoice
6. Customer melakukan pembayaran (Cash / Transfer / Piutang)
7. Stok otomatis berkurang
8. Sales history tercatat
```

#### Workflow 3: Inventory Adjustment
```
1. Staff gudang menemukan selisih stok (fisik vs sistem)
2. Membuat Stock Adjustment
3. Pilih tipe: Adjustment In (kelebihan) atau Adjustment Out (kekurangan)
4. Input alasan penyesuaian
5. Manager menyetujui adjustment
6. Stok sistem diperbarui
7. Adjustment history tercatat
```

---

## 1.5 Kebutuhan Fungsional

### Modul Authentication
| Kode | Kebutuhan |
|---|---|
| F-AUTH-01 | Pengguna dapat login menggunakan email dan password |
| F-AUTH-02 | Sistem memverifikasi kredensial dan memberikan token akses (Sanctum) |
| F-AUTH-03 | Pengguna dapat logout dan token direvoke |
| F-AUTH-04 | Pengguna dapat meminta reset password via email |
| F-AUTH-05 | Pengguna dapat mengganti password setelah reset |
| F-AUTH-06 | Pengguna dapat melihat dan mengupdate profil sendiri |
| F-AUTH-07 | Pengguna dapat mengganti password sendiri |

### Modul User Management
| Kode | Kebutuhan |
|---|---|
| F-USER-01 | Super Admin dapat membuat pengguna baru |
| F-USER-02 | Super Admin dapat melihat daftar semua pengguna |
| F-USER-03 | Super Admin dapat mengupdate data pengguna |
| F-USER-04 | Super Admin dapat menghapus (soft delete) pengguna |
| F-USER-05 | Super Admin dapat membuat role baru |
| F-USER-06 | Super Admin dapat menetapkan permission ke role |
| F-USER-07 | Super Admin dapat mengassign role ke pengguna |

### Modul Dashboard
| Kode | Kebutuhan |
|---|---|
| F-DASH-01 | Menampilkan ringkasan revenue (harian/mingguan/bulanan) |
| F-DASH-02 | Menampilkan ringkasan pengeluaran |
| F-DASH-03 | Menampilkan aktivitas terbaru (recent activity) |
| F-DASH-04 | Menampilkan alert stok menipis (low stock) |
| F-DASH-05 | Menampilkan statistik cepat (total produk, pelanggan, supplier) |

### Modul Product Management
| Kode | Kebutuhan |
|---|---|
| F-PROD-01 | User dapat membuat, membaca, mengupdate, menghapus produk |
| F-PROD-02 | User dapat mengelola kategori produk |
| F-PROD-03 | User dapat mengelola satuan produk (pcs, kg, box, dll) |
| F-PROD-04 | Sistem dapat generate barcode untuk produk |
| F-PROD-05 | User dapat mengupload gambar produk |
| F-PROD-06 | Produk memiliki informasi: nama, SKU, harga beli, harga jual, stok minimal |

### Modul Inventory Management
| Kode | Kebutuhan |
|---|---|
| F-INV-01 | User dapat mencatat stok masuk |
| F-INV-02 | User dapat mencatat stok keluar |
| F-INV-03 | User dapat melakukan penyesuaian stok |
| F-INV-04 | Sistem mencatat riwayat stok setiap perubahan |
| F-INV-05 | Sistem menampilkan stok real-time |

### Modul Supplier Management
| Kode | Kebutuhan |
|---|---|
| F-SUP-01 | User dapat membuat, membaca, mengupdate, menghapus supplier |
| F-SUP-02 | Data supplier mencakup: nama, kontak, alamat, NPWP |

### Modul Customer Management
| Kode | Kebutuhan |
|---|---|
| F-CUST-01 | User dapat membuat, membaca, mengupdate, menghapus customer |
| F-CUST-02 | Data customer mencakup: nama, kontak, alamat |

### Modul Purchase Management
| Kode | Kebutuhan |
|---|---|
| F-PUR-01 | User dapat membuat purchase order |
| F-PUR-02 | Purchase order memiliki status: pending, approved, received, cancelled |
| F-PUR-03 | User dapat melihat riwayat pembelian |
| F-PUR-04 | User dapat melihat detail pembelian |

### Modul Sales Management
| Kode | Kebutuhan |
|---|---|
| F-SALE-01 | User dapat membuat sales order |
| F-SALE-02 | Sistem generate invoice otomatis |
| F-SALE-03 | Invoice memiliki status payment: unpaid, partial, paid |
| F-SALE-04 | User dapat melihat riwayat penjualan |

### Modul Expense Management
| Kode | Kebutuhan |
|---|---|
| F-EXP-01 | User dapat membuat, membaca, mengupdate, menghapus pengeluaran |
| F-EXP-02 | User dapat mengelola kategori pengeluaran |

### Modul Reports
| Kode | Kebutuhan |
|---|---|
| F-REP-01 | Sistem dapat generate laporan penjualan (rentang tanggal) |
| F-REP-02 | Sistem dapat generate laporan pembelian (rentang tanggal) |
| F-REP-03 | Sistem dapat generate laporan stok |
| F-REP-04 | Sistem dapat generate laporan pengeluaran |

### Modul Activity Logs
| Kode | Kebutuhan |
|---|---|
| F-LOG-01 | Sistem mencatat login log (waktu, IP, user agent) |
| F-LOG-02 | Sistem mencatat aktivitas pengguna (create, update, delete data) |

### Modul Notification
| Kode | Kebutuhan |
|---|---|
| F-NOTIF-01 | Sistem menampilkan notifikasi in-app untuk stok menipis |
| F-NOTIF-02 | Sistem menampilkan notifikasi untuk purchase order yang perlu approval |

### Modul Settings
| Kode | Kebutuhan |
|---|---|
| F-SET-01 | User dapat mengupdate profil perusahaan (nama, alamat, telepon, logo) |
| F-SET-02 | Super Admin dapat mengatur konfigurasi aplikasi |

---

## 1.6 Kebutuhan Non-Fungsional

| Kode | Kategori | Kebutuhan |
|---|---|---|
| NF-01 | **Keamanan** | Semua password harus di-hash menggunakan bcrypt |
| NF-02 | **Keamanan** | Semua request API harus terautentikasi (kecuali login/register) |
| NF-03 | **Keamanan** | Implementasi RBAC untuk kontrol akses |
| NF-04 | **Keamanan** | CSRF protection aktif |
| NF-05 | **Keamanan** | Input validation di sisi server |
| NF-06 | **Keamanan** | Rate limiting pada endpoint autentikasi |
| NF-07 | **Performa** | Waktu respon API < 500ms untuk 95% request |
| NF-08 | **Performa** | Lighthouse score > 90 |
| NF-09 | **Performa** | First Contentful Paint (FCP) < 2s |
| NF-10 | **Performa** | Largest Contentful Paint (LCP) < 2.5s |
| NF-11 | **Performa** | Cumulative Layout Shift (CLS) < 0.1 |
| NF-12 | **Skalabilitas** | Sistem harus mendukung penambahan pengguna hingga 500+ |
| NF-13 | **Skalabilitas** | Database harus mendukung pertumbuhan data hingga jutaan record |
| NF-14 | **Ketersediaan** | Sistem harus memiliki uptime minimal 99.5% |
| NF-15 | **Maintainability** | Kode harus mengikuti PSR-12 (PHP) dan standar TypeScript |
| NF-16 | **Maintainability** | Service layer pattern untuk backend |
| NF-17 | **Maintainability** | Feature-based folder structure untuk frontend |
| NF-18 | **Responsivitas** | Sistem harus responsif di semua perangkat (mobile, tablet, desktop) |
| NF-19 | **Responsivitas** | Mobile-first design |
| NF-20 | **Aksesibilitas** | Mendukung WCAG 2.1 level AA |
| NF-21 | **Aksesibilitas** | Semantic HTML, keyboard navigation, screen reader support |
| NF-22 | **Reliabilitas** | Error handling di semua layer |
| NF-23 | **Reliabilitas** | Database transaction untuk operasi kritikal |
| NF-24 | **Testability** | Minimal 80% code coverage |
| NF-25 | **Testability** | Critical business logic 100% coverage |
| NF-26 | **Usability** | Antarmuka intuitif dan mudah digunakan |
| NF-27 | **Usability** | Loading state, error state, empty state di setiap komponen |
| NF-28 | **Portability** | Menggunakan Docker untuk environment konsisten |

---

## 1.7 Analisis SWOT Hideo ERP

| Positif | Negatif |
|---|---|
| **Strengths:** Open source, modern stack (Laravel 12 + React 19), enterprise grade, mobile responsive, full-featured untuk UMKM | **Weaknesses:** Membutuhkan resource server sendiri, perlu pengetahuan teknis untuk deployment |
| **Opportunities:** Pasar UMKM Indonesia sangat besar (64 juta+ UMKM), banyak yang belum menggunakan ERP | **Threats:** Banyak kompetitor ERP murah (bekas, accurate online, jurnal), perlu diferensiasi yang jelas |

---

## 1.8 Kesimpulan Business Analysis

Hideo ERP dirancang untuk menjembatani kesenjangan antara kebutuhan UMKM akan sistem informasi terintegrasi dengan keterbatasan biaya dan kompleksitas. Dengan pendekatan **enterprise-grade architecture** yang **sederhana digunakan**, Hideo ERP bertujuan menjadi solusi ERP pilihan utama bagi UMKM di Indonesia yang ingin bertransformasi digital.

--- _End of Phase 1 — Business Analysis_ ---
