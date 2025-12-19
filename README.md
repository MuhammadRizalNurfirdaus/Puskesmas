# Sistem Informasi Puskesmas

**Nama**: Muhammad Rizal Nurfirdaus  
**NIM**: 20230810088  
**Kelas**: TINFC-2023-04  
**Mata Kuliah**: Testing dan Implementasi  
**Dosen Pengampu**: Iwan Lesmana, S.Kom., M.Kom.

---

## Deskripsi

Sistem informasi untuk pengelolaan data pasien, kunjungan, rekam medis, dan resep obat di Puskesmas. Aplikasi ini dibangun dengan arsitektur client-server menggunakan stack MERN (MySQL, Express, React, Node.js) dengan TypeScript untuk memastikan type safety dan maintainability code yang lebih baik.

## Fitur Utama

- **Manajemen Pengguna**: Login dengan role-based access (Admin, Pendaftaran, Dokter, Apoteker, Kepala Puskesmas)
- **Pendaftaran Pasien**: Registrasi pasien baru dan lama, dengan status pembayaran (Umum/BPJS)
- **Kunjungan Rawat Jalan**: Pencatatan kunjungan pasien
- **Rekam Medis**: Pencatatan diagnosis dan tindakan medis oleh dokter
- **Resep Obat**: Pengelolaan resep dan stok obat di farmasi
- **Laporan**: Dashboard dan laporan untuk kepala puskesmas

## Teknologi yang Digunakan

### Backend
- Node.js + Express.js
- TypeScript
- TypeORM
- MySQL
- JWT Authentication

### Frontend
- React + TypeScript
- Vite
- React Router
- Axios
- Zustand (State Management)

## Instalasi

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm atau yarn

### Setup

1. Clone repository dari GitHub
```bash
git clone https://github.com/MuhammadRizalNurfirdaus/Puskesmas.git
cd Puskesmas
```

2. Install dependencies untuk root project
```bash
npm install
```

3. Setup Backend
```bash
cd backend
npm install
# File .env sudah tersedia dengan konfigurasi default
```

4. Setup Frontend
```bash
cd ../frontend
npm install
```

5. **Setup Database** (PENTING!)
   
   Database sudah ada user dan konfigurasi, tapi perlu dibuat database-nya:
   
   ```bash
   sudo mariadb
   ```
   
   Jalankan SQL commands berikut di MariaDB:
   ```sql
   CREATE DATABASE IF NOT EXISTS puskesmas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER IF NOT EXISTS 'puskesmas_user'@'localhost' IDENTIFIED BY 'puskesmas123';
   GRANT ALL PRIVILEGES ON puskesmas_db.* TO 'puskesmas_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```
   
   Test koneksi database:
   ```bash
   mariadb -u puskesmas_user -p'puskesmas123' puskesmas_db -e "SELECT 'Success!' as Status;"
   ```
   
   **Atau lihat file `DATABASE_SETUP.md` untuk panduan lengkap**

6. Jalankan aplikasi

   **Cara Mudah (Recommended):**
   ```bash
   ./start-app.sh
   ```
   
   **Atau manual:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```
   
   Untuk stop aplikasi:
   ```bash
   ./stop-app.sh
   ```

Akses aplikasi:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Default Users

Setelah setup, Anda dapat login dengan akun default:
- Admin: username `admin`, password `admin123`
- Pendaftaran: username `pendaftaran`, password `pendaftaran123`
- Dokter: username `dokter`, password `dokter123`
- Apoteker: username `apoteker`, password `apoteker123`
- Kepala Puskesmas: username `kepala`, password `kepala123`

## Struktur Project

```
Puskesmas/
├── backend/
│   ├── src/
│   │   ├── entities/       # Models database (User, Pasien, Kunjungan, dll)
│   │   ├── controllers/    # Business logic untuk setiap endpoint
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication, authorization, error handling
│   │   ├── config/         # Konfigurasi database dan app
│   │   └── index.ts        # Entry point backend
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Halaman-halaman aplikasi
│   │   ├── services/       # API calls
│   │   ├── stores/         # State management
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx         # Entry point frontend
│   └── package.json
└── package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Get current user

### Pasien
- GET `/api/pasien` - List semua pasien
- POST `/api/pasien` - Daftar pasien baru
- GET `/api/pasien/:id` - Detail pasien
- PUT `/api/pasien/:id` - Update data pasien

### Kunjungan
- GET `/api/kunjungan` - List kunjungan
- POST `/api/kunjungan` - Buat kunjungan baru
- GET `/api/kunjungan/:id` - Detail kunjungan

### Rekam Medis
- GET `/api/rekam-medis/pasien/:pasienId` - Rekam medis per pasien
- POST `/api/rekam-medis` - Buat rekam medis
- PUT `/api/rekam-medis/:id` - Update rekam medis

### Resep
- GET `/api/resep` - List resep
- POST `/api/resep` - Buat resep baru
- PUT `/api/resep/:id/status` - Update status resep

### Obat
- GET `/api/obat` - List obat
- POST `/api/obat` - Tambah obat baru
- PUT `/api/obat/:id` - Update stok obat

### Laporan
- GET `/api/laporan/kunjungan` - Laporan kunjungan
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
