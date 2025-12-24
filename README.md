# Sistem Informasi Manajemen Puskesmas

**Nama**: Muhammad Rizal Nurfirdaus  
**NIM**: 20230810088  
**Kelas**: TINFC-2023-04  
**Mata Kuliah**: Rekayasa Perangkat Lunak  
**Dosen Pengampu**: Iwan Lesmana, S.Kom., M.Kom.

---

## 📋 Deskripsi

Sistem Informasi Manajemen Puskesmas adalah aplikasi berbasis web yang dirancang untuk mengelola seluruh proses pelayanan kesehatan di Puskesmas secara digital dan terintegrasi. Aplikasi ini menyediakan solusi lengkap mulai dari pendaftaran pasien, pencatatan rekam medis, manajemen resep obat, hingga verifikasi pembayaran dan pelaporan statistik.

Aplikasi ini dibangun dengan arsitektur modern menggunakan **TypeScript** full-stack untuk memastikan type safety, **React** untuk user interface yang responsif, **Express.js** untuk backend API yang robust, dan **MySQL** sebagai database relasional yang reliable. Sistem ini mendukung multi-user dengan role-based access control (RBAC) untuk memastikan keamanan dan pembagian tugas yang jelas antara Admin, Petugas Pendaftaran, Dokter, Apoteker, dan Kepala Puskesmas.

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi
- Login dengan username/password dan Google OAuth
- Role-based access control (6 level: Admin, Pasien, Pendaftaran, Dokter, Apoteker, Kepala Puskesmas)
- JWT authentication untuk keamanan session
- Protected routes berdasarkan role user

### 👥 Manajemen Pasien
- Pendaftaran pasien baru dengan data lengkap (NIK, alamat, kontak, dll)
- Support pasien umum dan BPJS
- Pencarian dan filter pasien berdasarkan nama, NIK, atau nomor rekam medis
- Edit dan update data pasien
- Riwayat kunjungan per pasien

### 🏥 Kunjungan & Antrian
- Pendaftaran kunjungan rawat jalan, kontrol, atau darurat
- Sistem antrian digital dengan nomor urut otomatis
- Pencatatan keluhan awal pasien
- Status tracking (Terdaftar → Pemeriksaan → Farmasi → Selesai)
- Detail kunjungan lengkap dengan info pasien dan rekam medis

### 📝 Rekam Medis Elektronik
- Pencatatan anamnesa dan pemeriksaan fisik
- Input vital signs (tekanan darah, berat badan, tinggi badan, suhu tubuh)
- Diagnosis dan tindakan medis
- Catatan tambahan dokter
- Riwayat rekam medis per pasien dengan pencarian
- View detail lengkap rekam medis termasuk resep obat

### 💊 Manajemen Resep & Farmasi
- Pembuatan resep obat digital dari dokter
- Detail resep dengan daftar obat, jumlah, dan aturan pakai
- Status resep (Pending, Diproses, Selesai, Batal)
- Penyerahan obat oleh apoteker dengan tracking
- Manajemen stok obat dengan alert stok minimal
- Laporan obat yang perlu restocking

### 💰 Transaksi & Pembayaran
- Pencatatan transaksi pembayaran pasien
- Breakdown biaya (pendaftaran, pemeriksaan, obat, tindakan)
- Support multiple metode pembayaran (Tunai, Transfer, Debit, BPJS)
- Sistem verifikasi pembayaran oleh Kepala Puskesmas
- Dashboard total pembayaran lunas dan pending
- Riwayat pembayaran per pasien

### 📊 Laporan & Statistik
- Dashboard real-time dengan metrics penting:
  - Kunjungan hari ini
  - Total pasien terdaftar
  - Resep pending
  - Stok obat rendah
  - Total pembayaran lunas
  - Pembayaran menunggu verifikasi
- Laporan kunjungan dengan filter tanggal
- Grafik tren kunjungan harian
- Statistik pasien (Umum vs BPJS, Jenis Kelamin)
- Chart stok obat prioritas
- Export data untuk audit dan arsip

## 🛠 Teknologi yang Digunakan

### Backend
- **Node.js** v18+ - JavaScript runtime
- **Express.js** - Web framework untuk REST API
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - ORM untuk MySQL dengan Entity mapping
- **MySQL/MariaDB** - Relational database
- **JWT** - JSON Web Token untuk authentication
- **bcrypt** - Password hashing
- **Google OAuth 2.0** - Social login integration
- **cors** - Cross-Origin Resource Sharing

### Frontend
- **React 18** - UI library dengan hooks
- **TypeScript** - Strongly typed React components
- **Vite** - Fast build tool dan dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client untuk API calls
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library untuk visualisasi data
- **@react-oauth/google** - Google login integration

### Database Schema
- **users** - Data user dengan role
- **pasien** - Data pasien dengan NIK dan status pembayaran
- **kunjungan** - Kunjungan pasien dengan status tracking
- **rekam_medis** - Rekam medis elektronik lengkap
- **resep** & **resep_detail** - Resep obat dan detail item
- **obat** - Master data obat dengan stok management
- **transaksi** - Transaksi pembayaran dengan verifikasi

## 📦 Instalasi

### Prerequisites
Pastikan Anda sudah menginstall:
- **Node.js** v18 atau lebih tinggi ([Download](https://nodejs.org/))
- **MySQL** 8.0+ atau **MariaDB** 10.5+ ([Download MySQL](https://dev.mysql.com/downloads/) atau [Download MariaDB](https://mariadb.org/download/))
- **npm** atau **yarn** (sudah termasuk dengan Node.js)
- **Git** untuk clone repository ([Download](https://git-scm.com/))

### Setup Project

1. **Clone repository dari GitHub**
```bash
git clone https://github.com/MuhammadRizalNurfirdaus/Puskesmas.git
cd Puskesmas
```

2. **Install dependencies untuk root project**
```bash
npm install
```

3. **Setup Backend**
```bash
cd backend
npm install
```

4. **Setup Frontend**
```bash
cd frontend
npm install
cd ..
```

5. **Setup Database** (PENTING!)
   
   Jalankan perintah berikut untuk membuat database:
   
   ```bash
   sudo mariadb
   ```
   
   Atau jika menggunakan MySQL:
   ```bash
   sudo mysql
   ```
   
   Kemudian jalankan SQL commands berikut:
   ```sql
   CREATE DATABASE IF NOT EXISTS puskesmas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER IF NOT EXISTS 'puskesmas_user'@'localhost' IDENTIFIED BY 'puskesmas123';
   GRANT ALL PRIVILEGES ON puskesmas_db.* TO 'puskesmas_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```
   
   **Test koneksi database:**
   ```bash
   mariadb -u puskesmas_user -ppuskesmas123 puskesmas_db -e "SELECT 'Database Connected!' as Status;"
   ```
   
   **Catatan:** Untuk panduan lengkap setup database, lihat file `DATABASE_SETUP.md`

6. **Konfigurasi Environment Variables**

   File `.env` sudah tersedia di folder `backend/` dan `frontend/` dengan konfigurasi default yang siap pakai:
   
   **Backend** (`backend/.env`):
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=puskesmas_user
   DB_PASSWORD=puskesmas123
   DB_NAME=puskesmas_db
   
   PORT=5000
   JWT_SECRET=your-secret-key-here
   
   GOOGLE_CLIENT_ID=your-google-client-id
   ```
   
   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```
   
   > **Opsional:** Jika ingin menggunakan Google Login, ubah `GOOGLE_CLIENT_ID` dengan Client ID Anda dari [Google Cloud Console](https://console.cloud.google.com/)

7. **Jalankan Aplikasi**

   **Cara Mudah - Menggunakan Script (Recommended):**
   ```bash
   ./start-app.sh
   ```
   
   Script ini akan:
   - ✅ Cek prerequisites (Node.js, npm, MySQL/MariaDB)
   - ✅ Menjalankan backend di port 5000
   - ✅ Menjalankan frontend di port 5173
   - ✅ Menyimpan PID untuk stop script
   - ✅ Menampilkan URL akses aplikasi
   
   **Atau Manual (2 Terminal):**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```
   
   **Untuk stop aplikasi:**
   ```bash
   ./stop-app.sh
   ```

8. **Akses Aplikasi**

   Buka browser dan akses:
   - 🌐 **Frontend**: http://localhost:5173
   - 🔧 **Backend API**: http://localhost:5000
   - 📊 **API Health Check**: http://localhost:5000/api/health

## 👤 Default Users & Testing

Setelah setup, aplikasi otomatis membuat user default yang bisa Anda gunakan untuk testing:

| Role | Username | Password | Deskripsi |
|------|----------|----------|-----------|
| Admin | `admin` | `admin123` | Full access ke semua fitur |
| Pendaftaran | `pendaftaran` | `pendaftaran123` | Daftar pasien & kunjungan |
| Dokter | `dokter` | `dokter123` | Periksa pasien & buat resep |
| Apoteker | `apoteker` | `apoteker123` | Kelola resep & stok obat |
| Kepala Puskesmas | `kepala` | `kepala123` | Laporan & verifikasi pembayaran |
| Pasien | `pasien` | `pasien123` | Lihat riwayat kunjungan sendiri |

**Atau login dengan Google OAuth** untuk membuat akun pasien baru secara otomatis.

## 📁 Struktur Project

```
Puskesmas/
├── backend/                    # Backend API Server
│   ├── src/
│   │   ├── entities/          # Database Models (TypeORM Entities)
│   │   │   ├── User.ts        # Model user dengan role
│   │   │   ├── Pasien.ts      # Model pasien
│   │   │   ├── Kunjungan.ts   # Model kunjungan
│   │   │   ├── RekamMedis.ts  # Model rekam medis
│   │   │   ├── Resep.ts       # Model resep obat
│   │   │   ├── Obat.ts        # Model master obat
│   │   │   └── Transaksi.ts   # Model transaksi pembayaran
│   │   ├── controllers/       # Business Logic
│   │   │   ├── authController.ts
│   │   │   ├── pasienController.ts
│   │   │   ├── kunjunganController.ts
│   │   │   ├── rekamMedisController.ts
│   │   │   ├── resepController.ts
│   │   │   ├── obatController.ts
│   │   │   ├── transaksiController.ts
│   │   │   └── laporanController.ts
│   │   ├── routes/            # API Routes
│   │   ├── middleware/        # Authentication & Authorization
│   │   ├── config/            # Database & App Configuration
│   │   ├── utils/             # Utilities & Seeder
│   │   └── index.ts           # Entry Point Backend
│   ├── .env                   # Environment Variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Frontend React App
│   ├── src/
│   │   ├── components/        # Reusable Components
│   │   │   ├── Layout.tsx     # Main layout wrapper
│   │   │   └── Navbar.tsx     # Navigation sidebar
│   │   ├── pages/             # Page Components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Pasien/        # Pasien management pages
│   │   │   ├── Kunjungan/     # Kunjungan pages
│   │   │   ├── RekamMedis/    # Rekam medis pages
│   │   │   ├── Resep/         # Resep pages
│   │   │   ├── Obat/          # Obat pages
│   │   │   ├── Transaksi/     # Transaksi pages
│   │   │   ├── Laporan/       # Laporan & statistik
│   │   │   └── Antrian/       # Antrian digital
│   │   ├── services/          # API Service Layer
│   │   │   └── api.ts         # Axios instance & interceptors
│   │   ├── stores/            # State Management (Zustand)
│   │   │   └── authStore.ts   # Authentication state
│   │   ├── types/             # TypeScript Interfaces
│   │   │   └── index.ts       # Type definitions
│   │   ├── utils/             # Utility Functions
│   │   ├── App.tsx            # Main App Component
│   │   ├── main.tsx           # Entry Point
│   │   └── index.css          # Global Styles
│   ├── .env                   # Environment Variables
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.cjs
│   └── tsconfig.json
│
├── .gitignore
├── package.json               # Root package.json
├── start-app.sh              # Script untuk start server
├── stop-app.sh               # Script untuk stop server
├── DATABASE_SETUP.md         # Panduan setup database
├── QUICK_START.md            # Quick start guide
└── README.md                 # Dokumentasi ini
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login              # Login dengan username/password
POST   /api/auth/google-login       # Login dengan Google OAuth
POST   /api/auth/logout             # Logout
GET    /api/auth/me                 # Get current logged in user
```

### Pasien Management
```
GET    /api/pasien                  # List semua pasien
POST   /api/pasien                  # Registrasi pasien baru
GET    /api/pasien/:id              # Detail pasien by ID
PUT    /api/pasien/:id              # Update data pasien
DELETE /api/pasien/:id              # Soft delete pasien
```

### Kunjungan
```
GET    /api/kunjungan               # List kunjungan (dengan filter)
POST   /api/kunjungan               # Daftar kunjungan baru
GET    /api/kunjungan/:id           # Detail kunjungan lengkap
PUT    /api/kunjungan/:id/status    # Update status kunjungan
```

### Rekam Medis
```
GET    /api/rekam-medis             # List semua rekam medis
GET    /api/rekam-medis/pasien/:id  # Rekam medis per pasien
GET    /api/rekam-medis/:id         # Detail rekam medis by ID
POST   /api/rekam-medis             # Buat rekam medis baru (Dokter only)
PUT    /api/rekam-medis/:id         # Update rekam medis
```

### Resep Obat
```
GET    /api/resep                   # List resep dengan filter
POST   /api/resep                   # Buat resep baru (Dokter only)
GET    /api/resep/:id               # Detail resep with items
PUT    /api/resep/:id/status        # Update status resep (Apoteker)
```

### Obat Management
```
GET    /api/obat                    # List obat aktif
POST   /api/obat                    # Tambah obat baru
GET    /api/obat/:id                # Detail obat
PUT    /api/obat/:id                # Update data obat
PUT    /api/obat/:id/stock          # Update stok obat
```

### Transaksi & Pembayaran
```
GET    /api/transaksi               # List transaksi
POST   /api/transaksi               # Buat transaksi baru
GET    /api/transaksi/:id           # Detail transaksi
PUT    /api/transaksi/:id/verify    # Verifikasi pembayaran (Kepala Puskesmas)
```

### Laporan & Statistik
```
GET    /api/laporan/dashboard       # Dashboard metrics
GET    /api/laporan/kunjungan       # Laporan kunjungan (dengan filter tanggal)
GET    /api/laporan/pasien          # Statistik pasien
GET    /api/laporan/obat            # Laporan stok obat
```

## 🚀 Scripts yang Tersedia

### Root Project
```bash
npm install              # Install dependencies untuk semua folder
```

### Backend
```bash
cd backend
npm install             # Install dependencies
npm run dev             # Run development server dengan hot reload
npm run build           # Compile TypeScript ke JavaScript
npm start               # Run production server
```

### Frontend
```bash
cd frontend
npm install             # Install dependencies
npm run dev             # Run development server dengan hot reload
npm run build           # Build production
npm run preview         # Preview production build
```

### Utility Scripts
```bash
./start-app.sh          # Start backend + frontend sekaligus
./stop-app.sh           # Stop semua server yang running
```
- GET `/api/laporan/pasien` - Statistik pasien
- GET `/api/laporan/obat` - Laporan stok obat

## Panduan Git Clone

Untuk melakukan git clone dan menjalankan project ini, ikuti langkah-langkah berikut:

### 1. Clone Repository
```bash
git clone https://github.com/MuhammadRizalNurfirdaus/Puskesmas.git
cd Puskesmas
```

### 2. Install Dependencies
```bash
# Install dependencies root project
npm install

# Install dependencies backend
cd backend
npm install

# Install dependencies frontend
cd ../frontend
npm install
cd ..
```

### 3. Konfigurasi Database
```bash
# Buat file .env di folder backend
cd backend
cp .env.example .env
```

Edit file `.env` dengan konfigurasi database Anda:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=puskesmas_db
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. Buat Database MySQL
Buka MySQL client dan jalankan:
```sql
CREATE DATABASE puskesmas_db;
```

### 5. Jalankan Aplikasi
Kembali ke root folder dan jalankan:
```bash
cd ..
npm run dev
```

Atau jalankan secara terpisah:
- **Backend**: `cd backend && npm run dev` (http://localhost:5000)
- **Frontend**: `cd frontend && npm run dev` (http://localhost:3000)

### 6. Akses Aplikasi
Buka browser dan akses `http://localhost:3000` untuk menggunakan aplikasi.

## Repository

GitHub: [https://github.com/MuhammadRizalNurfirdaus/Puskesmas.git](https://github.com/MuhammadRizalNurfirdaus/Puskesmas.git)

## Lisensi

MIT
