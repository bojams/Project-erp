# 🏪 Hideo ERP

**Sistem POS & Inventaris untuk Bisnis Retail** — Dibangun dengan Laravel 12 + React 19.

> Cocok untuk toko, distributor, atau bisnis kecil-menengah yang butuh sistem kasir dan manajemen stok yang rapi.

---

## 📸 Sekilas Fitur

| Halaman | Fitur |
|---------|-------|
| 🏠 Dashboard | Grafik pendapatan vs pengeluaran, stat real-time, stok menipis |
| 📦 Produk | CRUD produk, upload gambar, atur stok minimum |
| 🛒 Penjualan (POS) | Grid produk, keranjang, bayar Cash/QRIS, riwayat transaksi |
| 📥 Pembelian | Catat pembelian dari supplier, stok otomatis bertambah |
| ⚙️ Pengaturan | Data perusahaan, ganti tema (terang/gelap/sistem), ganti password |
| 📱 Mobile Friendly | Tampilan kartu, bottom navigasi, layout menyesuaikan layar |

---

## 🧱 Teknologi

**Backend:** Laravel 12, PHP 8.4, MySQL/SQLite, Redis, Sanctum (Auth API), Spatie (Role & Permission)
**Frontend:** React 19, TypeScript, Vite, Chakra UI v3, TanStack Query, Zustand, React Hook Form + Zod
**Testing:** Pest PHP (backend), Vitest + React Testing Library (frontend)

---

## 📋 Tutorial Instalasi Lengkap

Ikuti langkah-langkah berikut untuk menjalankan Hideo ERP di komputer kamu.

### 🔧 Persiapan

Pastikan sudah terinstall:

- **PHP 8.4** atau lebih baru
- **Composer** (manajer dependensi PHP)
- **Node.js 20** atau lebih baru
- **MySQL 8** (atau SQLite — lebih mudah untuk development)
- **Redis** (untuk cache & queue)

Cek semua sudah siap:

```bash
php -v
composer --version
node -v
npm -v
```

---

### 1. 📥 Clone Project

```bash
git clone https://github.com/bojams/Project-erp.git
cd Project-erp
```

---

### 2. ⚙️ Setup Backend

```bash
cd backend

# Install semua dependency PHP
composer install

# Buat file environment
cp .env.example .env
```

Buka `.env` dengan editor teks. Sesuaikan konfigurasi database:

**Opsi A — Pakai SQLite (mudah, tanpa install database):**
```env
DB_CONNECTION=sqlite
# Hapus atau komen baris DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
# Pastikan ada file database/hideo.sqlite (buat manual jika belum):
# touch database/hideo.sqlite
```

**Opsi B — Pakai MySQL:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hideo_erp
DB_USERNAME=root
DB_PASSWORD=password_kamu
```

Jalankan perintah berikut:

```bash
# Generate key aplikasi
php artisan key:generate

# Jalankan migrasi + seeder (membuat tabel + data awal)
php artisan migrate --seed

# Buat symlink storage (untuk upload gambar)
php artisan storage:link

# Mulai server backend
php artisan serve --port=8001
```

> ✅ Backend akan berjalan di `http://localhost:8001`

---

### 3. 🎨 Setup Frontend

Buka terminal baru:

```bash
cd frontend

# Install semua dependency JavaScript
npm install

# Jalankan development server
npm run dev
```

> ✅ Frontend akan berjalan di `http://localhost:5174` (otomatis proxy API ke port 8001)

---

### 4. 🔐 Login

Buka `http://localhost:5174` di browser.

Gunakan akun berikut (dari seeder awal):

| Email | Password | Role |
|-------|----------|------|
| `owner@hideo.com` | `password` | Owner |

---

## 🗂️ Struktur Folder

```
project-erp/
├── backend/                  # API Laravel
│   ├── app/
│   │   ├── Enums/            # PaymentMethod, SaleStatus, dll
│   │   ├── Http/
│   │   │   ├── Controllers/  # Controller (tipis — hanya terima request)
│   │   │   ├── Requests/     # Validasi form
│   │   │   └── Resources/    # Format response API
│   │   ├── Models/           # Model database
│   │   ├── Services/         # Logic bisnis (disini semua logika)
│   │   └── Traits/           # Code reuse
│   ├── database/
│   │   ├── migrations/       # Struktur tabel
│   │   ├── factories/        # Data dummy
│   │   └── seeders/          # Data awal
│   └── routes/api.php        # Endpoint API
│
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── api/              # Panggilan API
│   │   ├── components/       # Komponen UI
│   │   ├── features/         # Fitur spesifik
│   │   ├── layouts/          # Layout halaman
│   │   ├── pages/            # Halaman aplikasi
│   │   ├── stores/           # State global (Zustand)
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Fungsi bantuan
│   └── ...
│
└── docs/                     # Dokumentasi lengkap (17 fase)
```

---

## 🧪 Testing

```bash
# Backend
cd backend && php artisan test

# Frontend
cd frontend && npm run test
```

---

## 🚧 Roadmap

- [x] Login & autentikasi
- [x] Manajemen produk + kategori
- [x] POS penjualan (Cash / QRIS)
- [x] Pembelian dari supplier
- [x] Dashboard dengan grafik
- [x] Dark mode (3 tema)
- [ ] Cetak struk / invoice
- [ ] Laporan laba rugi
- [ ] Export Excel / PDF
- [ ] Manajemen diskon & promo
- [ ] Multi-currency

---

## 🆘 Troubleshooting

**"Port 8001 sudah dipakai"**
```bash
php artisan serve --port=8002
```
Lalu update `frontend/vite.config.ts` ubah proxy ke `http://localhost:8002`.

**"Class not found" atau error setelah pull**
```bash
cd backend && composer dump-autoload && php artisan migrate
```

**"SQLite database not found"**
```bash
cd backend && touch database/hideo.sqlite && php artisan migrate --seed
```

---

<p align="center">Dibuat dengan ❤️ — bojams</p>
