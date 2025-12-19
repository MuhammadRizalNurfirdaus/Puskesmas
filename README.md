# Sistem Informasi Puskesmas

Sistem informasi untuk pengelolaan data pasien, kunjungan, rekam medis, dan resep obat di Puskesmas.

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

1. Clone repository dan masuk ke folder project
```bash
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
cp .env.example .env
# Edit .env dengan konfigurasi database Anda
```

4. Setup Frontend
```bash
cd ../frontend
npm install
```

5. Setup Database
- Buat database MySQL dengan nama `puskesmas_db`
```sql
CREATE DATABASE puskesmas_db;
```
- Database akan otomatis ter-setup saat aplikasi dijalankan pertama kali

6. Jalankan aplikasi

Dari root folder:
```bash
npm run dev
```

Atau jalankan secara terpisah:
- Backend: `cd backend && npm run dev` (http://localhost:5000)
- Frontend: `cd frontend && npm run dev` (http://localhost:3000)

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

## Lisensi

MIT
