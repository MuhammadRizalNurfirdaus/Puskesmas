# Dokumentasi Penyesuaian Sistem dengan Use Case Diagram

## 📋 Ringkasan Perubahan

Sistem telah disesuaikan dengan diagram use case yang menampilkan 6 aktor/role dan fitur-fitur yang sesuai dengan masing-masing role.

## 👥 Role Pengguna

Sistem sekarang mendukung 6 role pengguna:

### 1. **Admin Sistem**
- Username: `admin`
- Password: `admin123`
- **Fitur yang dapat diakses:**
  - Kelola User
  - Kelola Obat
  - Kelola Resep
  - Backup Data Sistem

### 2. **Pasien**
- Username: `pasien`
- Password: `pasien123`
- **Fitur yang dapat diakses:**
  - 👀 Lihat Antrian (auto-refresh setiap 30 detik)
  - 💰 Pembayaran
  - 📝 Daftar/Lihat Data Pasien

### 3. **Petugas Pendaftaran**
- Username: `pendaftaran`
- Password: `pendaftaran123`
- **Fitur yang dapat diakses:**
  - 👤 Kelola Data Pasien
  - ➕ Input Data Pasien
  - 📝 Input Data Kunjungan

### 4. **Dokter**
- Username: `dokter`
- Password: `dokter123`
- **Fitur yang dapat diakses:**
  - 🩺 Pemeriksaan Medis
  - 📋 Buat Rekam Medis
  - 💊 Buat Resep Obat

### 5. **Apoteker**
- Username: `apoteker`
- Password: `apoteker123`
- **Fitur yang dapat diakses:**
  - 💊 Serahkan Obat ke Pasien
  - 📦 Kelola Stok Obat
  - 📝 Input Resep Obat

### 6. **Kepala Puskesmas**
- Username: `kepala`
- Password: `kepala123`
- **Fitur yang dapat diakses:**
  - 📊 Lihat Statistik Pelayanan
  - 📈 Lihat Laporan Harian
  - ✅ Verifikasi Pembayaran

## 🎨 Perbaikan Tampilan

### Halaman Login
- ✅ Tampilan lebih informatif dengan deskripsi setiap role
- ✅ Card login lebih lebar (max-width: 600px)
- ✅ Informasi akses untuk setiap role ditampilkan dengan jelas
- ✅ Icon untuk setiap role
- ✅ Deskripsi fungsi utama setiap role

### Dashboard
- ✅ Quick actions yang disesuaikan dengan role masing-masing user
- ✅ Statistik hanya ditampilkan untuk role yang relevan (tidak untuk Pasien)
- ✅ Label role yang lebih deskriptif
- ✅ Tampilan yang lebih profesional dengan icon

### Navbar
- ✅ Menu navigasi dinamis sesuai role
- ✅ Badge role pada navbar untuk identifikasi cepat
- ✅ Nama lengkap user ditampilkan
- ✅ Setiap role hanya melihat menu yang relevan

### Halaman Antrian (Fitur Baru)
- ✅ Halaman khusus untuk pasien melihat antrian
- ✅ Auto-refresh setiap 30 detik
- ✅ Tampilan nomor antrian yang jelas
- ✅ Status berwarna untuk setiap tahap (Terdaftar, Pemeriksaan, Farmasi, Selesai)
- ✅ Informasi detail kunjungan
- ✅ Legenda status di bagian bawah

## 📁 File yang Dimodifikasi

### Backend
1. **`backend/src/entities/User.ts`**
   - Menambahkan role `PASIEN`

2. **`backend/src/utils/seed.ts`**
   - Menambahkan user default untuk role Pasien
   - Memperbaiki informasi kontak dan gelar untuk user lain

### Frontend
1. **`frontend/src/types/index.ts`**
   - Menambahkan role `PASIEN` ke enum

2. **`frontend/src/pages/Login.tsx`**
   - Redesign tampilan dengan informasi role yang lengkap
   - Menambahkan deskripsi fitur untuk setiap role

3. **`frontend/src/pages/Dashboard.tsx`**
   - Quick actions dinamis berdasarkan role
   - Fungsi `getRoleLabel()` untuk label yang lebih baik
   - Fungsi `renderQuickActions()` untuk menu sesuai role

4. **`frontend/src/components/Navbar.tsx`**
   - Menu navigasi dinamis dengan fungsi `renderMenuByRole()`
   - Badge role di navbar
   - Menu yang disesuaikan untuk setiap role

5. **`frontend/src/pages/Antrian/Antrian.tsx`** (Baru)
   - Halaman untuk melihat antrian kunjungan
   - Auto-refresh setiap 30 detik
   - Tampilan status berwarna

6. **`frontend/src/App.tsx`**
   - Menambahkan route `/antrian`

7. **`frontend/src/index.css`**
   - Memperlebar login card (600px)
   - Menambahkan overflow untuk scroll jika konten panjang

## 🎯 Alur Sistem Berdasarkan Use Case

### Alur Pasien
1. Login sebagai Pasien → Dashboard
2. Lihat Antrian → Pantau posisi antrian real-time
3. Pembayaran → Lihat dan bayar tagihan
4. Data Pasien → Lihat informasi pribadi

### Alur Petugas Pendaftaran
1. Login → Dashboard
2. Input Data Pasien → Registrasi pasien baru
3. Buat Kunjungan → Daftarkan kunjungan pasien
4. Kelola Data Pasien → Edit/Update data

### Alur Dokter
1. Login → Dashboard
2. Lihat Kunjungan → Pilih pasien yang akan diperiksa
3. Pemeriksaan Medis → Input hasil pemeriksaan
4. Buat Rekam Medis → Simpan diagnosa dan tindakan
5. Buat Resep → Buat resep obat jika diperlukan

### Alur Apoteker
1. Login → Dashboard
2. Lihat Resep → Cek resep yang masuk
3. Kelola Stok Obat → Update stok obat
4. Serahkan Obat → Proses penyerahan obat ke pasien

### Alur Kepala Puskesmas
1. Login → Dashboard
2. Lihat Statistik → Pantau performa pelayanan
3. Lihat Laporan → Review laporan harian/periodik
4. Verifikasi → Verifikasi pembayaran dan transaksi

### Alur Admin Sistem
1. Login → Dashboard
2. Kelola User → Tambah/Edit/Hapus user
3. Kelola Obat → Manajemen master data obat
4. Kelola Resep → Monitoring semua resep
5. Backup Data → Backup database sistem

## 🚀 Cara Menjalankan

1. **Setup Database** (jika belum):
   ```bash
   ./setup-database.sh
   ```

2. **Start Aplikasi**:
   ```bash
   ./start-app.sh
   ```

3. **Akses Aplikasi**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

4. **Login dengan salah satu akun**:
   - Pilih role sesuai kebutuhan testing
   - Gunakan username dan password sesuai tabel di atas

## ✨ Fitur Utama

- ✅ Role-Based Access Control (RBAC)
- ✅ Dashboard dinamis sesuai role
- ✅ Menu navigasi yang disesuaikan
- ✅ Halaman antrian real-time untuk pasien
- ✅ Tampilan modern dan responsif
- ✅ Auto-refresh untuk data real-time
- ✅ Status berwarna untuk tracking
- ✅ Quick actions untuk akses cepat

## 📝 Catatan Penting

1. **Middleware Authorization** sudah mendukung semua role baru
2. **Seed Data** akan otomatis membuat 6 user default saat pertama kali setup
3. **Halaman Antrian** menggunakan auto-refresh setiap 30 detik
4. **Dashboard** menampilkan konten berbeda untuk setiap role
5. **Navbar** menampilkan menu sesuai hak akses role

## 🔄 Migrasi Database

Jika sudah ada database sebelumnya, jalankan:

```bash
# Stop aplikasi
./stop-app.sh

# Setup ulang database
./setup-database.sh

# Start kembali
./start-app.sh
```

Ini akan membuat user baru termasuk role Pasien.
