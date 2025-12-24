# Panduan Fitur Transaksi dan Verifikasi Pembayaran

## 📋 Overview

Fitur transaksi dan verifikasi pembayaran telah berhasil ditambahkan ke Sistem Informasi Puskesmas. Fitur ini memungkinkan:

1. **Petugas Pendaftaran** untuk membuat dan mengelola transaksi pembayaran pasien
2. **Kepala Puskesmas** untuk memverifikasi dan menyetujui/menolak pembayaran
3. **Admin** untuk mengelola seluruh data transaksi

---

## 🗄️ Struktur Database

### Tabel Transaksi

Tabel `transaksi` memiliki kolom-kolom berikut:

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| idTransaksi | INT (PK) | ID unik transaksi |
| noTransaksi | VARCHAR | Nomor transaksi (format: TRX/YYYYMMDD/XXXX) |
| idKunjungan | INT | ID kunjungan terkait |
| idPasien | INT | ID pasien |
| tanggalTransaksi | DATETIME | Tanggal dan waktu transaksi dibuat |
| biayaPendaftaran | DECIMAL | Biaya pendaftaran (default: Rp 10.000) |
| biayaPemeriksaan | DECIMAL | Biaya pemeriksaan (default: Rp 50.000) |
| biayaObat | DECIMAL | Total biaya obat dari resep |
| biayaTindakan | DECIMAL | Biaya tindakan medis |
| diskon | DECIMAL | Diskon yang diberikan |
| totalBiaya | DECIMAL | Total biaya setelah diskon |
| metodePembayaran | ENUM | tunai, transfer, debit, bpjs |
| statusPembayaran | ENUM | lunas, belum_dibayar, dibatalkan |
| statusVerifikasi | ENUM | menunggu, disetujui, ditolak |
| idKasir | INT | ID petugas yang membuat transaksi |
| idVerifikator | INT | ID kepala puskesmas yang memverifikasi |
| tanggalVerifikasi | DATETIME | Tanggal verifikasi |
| catatanVerifikasi | TEXT | Catatan dari verifikator |
| keterangan | TEXT | Keterangan tambahan |

### Enumerasi

#### MetodePembayaran
- `tunai` - Pembayaran tunai
- `transfer` - Transfer bank
- `debit` - Kartu debit
- `bpjs` - BPJS Kesehatan

#### StatusPembayaran
- `lunas` - Sudah dibayar
- `belum_dibayar` - Belum dibayar
- `dibatalkan` - Transaksi dibatalkan

#### StatusVerifikasi
- `menunggu` - Menunggu verifikasi
- `disetujui` - Disetujui kepala puskesmas
- `ditolak` - Ditolak kepala puskesmas

---

## 🔧 Backend API Endpoints

### 1. GET /api/transaksi
**Akses:** Admin, Pendaftaran, Kepala Puskesmas

Mendapatkan semua data transaksi dengan relasi lengkap (kunjungan, pasien, kasir, verifikator).

**Response:**
```json
[
  {
    "idTransaksi": 1,
    "noTransaksi": "TRX/20241215/0001",
    "totalBiaya": 135000,
    "statusPembayaran": "lunas",
    "statusVerifikasi": "menunggu",
    "pasien": { ... },
    "kunjungan": { ... },
    "kasir": { ... }
  }
]
```

### 2. GET /api/transaksi/:id
**Akses:** Admin, Pendaftaran, Kepala Puskesmas

Mendapatkan detail transaksi berdasarkan ID, termasuk detail resep dan obat.

**Response:**
```json
{
  "idTransaksi": 1,
  "noTransaksi": "TRX/20241215/0001",
  "biayaPendaftaran": 10000,
  "biayaPemeriksaan": 50000,
  "biayaObat": 75000,
  "biayaTindakan": 0,
  "diskon": 0,
  "totalBiaya": 135000,
  "metodePembayaran": "tunai",
  "statusPembayaran": "lunas",
  "statusVerifikasi": "menunggu",
  "pasien": { ... },
  "kunjungan": { ... },
  "resep": {
    "detail": [ ... ]
  }
}
```

### 3. POST /api/transaksi
**Akses:** Admin, Pendaftaran

Membuat transaksi baru. Biaya otomatis dihitung dari kunjungan dan resep.

**Request Body:**
```json
{
  "idKunjungan": 1,
  "metodePembayaran": "tunai",
  "diskon": 0,
  "keterangan": "Pembayaran lengkap"
}
```

**Response:**
```json
{
  "idTransaksi": 1,
  "noTransaksi": "TRX/20241215/0001",
  "totalBiaya": 135000,
  ...
}
```

### 4. PATCH /api/transaksi/:id/verifikasi
**Akses:** Admin, Kepala Puskesmas

Memverifikasi transaksi (menyetujui/menolak).

**Request Body:**
```json
{
  "statusVerifikasi": "disetujui",
  "catatanVerifikasi": "Pembayaran sesuai, disetujui"
}
```

### 5. PUT /api/transaksi/:id
**Akses:** Admin

Update data transaksi.

### 6. DELETE /api/transaksi/:id
**Akses:** Admin

Hapus transaksi.

---

## 💻 Frontend Components

### 1. TransaksiList.tsx
**Lokasi:** `frontend/src/pages/Transaksi/TransaksiList.tsx`

**Fitur:**
- Tabel daftar transaksi dengan pagination
- Filter berdasarkan:
  - Status Pembayaran (lunas, belum_dibayar, dibatalkan)
  - Status Verifikasi (menunggu, disetujui, ditolak)
  - Pencarian berdasarkan No. Transaksi atau Nama Pasien
- Badge berwarna untuk status
- Link ke halaman detail transaksi
- Tombol "Transaksi Baru" (untuk Petugas Pendaftaran)

### 2. TransaksiForm.tsx
**Lokasi:** `frontend/src/pages/Transaksi/TransaksiForm.tsx`

**Fitur:**
- Form input transaksi baru
- Dropdown pilih kunjungan yang sudah selesai
- Otomatis menghitung total biaya:
  - Biaya Pendaftaran: Rp 10.000
  - Biaya Pemeriksaan: Rp 50.000
  - Biaya Obat: Dari resep
  - Biaya Tindakan: Rp 0 (default)
- Input diskon dengan kalkulasi real-time
- Pilihan metode pembayaran (Tunai, Transfer, Debit, BPJS)
- Field keterangan

### 3. TransaksiDetail.tsx
**Lokasi:** `frontend/src/pages/Transaksi/TransaksiDetail.tsx`

**Fitur:**
- Tampilan lengkap detail transaksi
- Informasi pasien dan kunjungan
- Rincian biaya lengkap dengan breakdown
- Informasi pembayaran dan kasir
- **Form Verifikasi (khusus Kepala Puskesmas):**
  - Input catatan verifikasi
  - Tombol Setujui (hijau)
  - Tombol Tolak (merah)
  - Konfirmasi sebelum submit
- Riwayat verifikasi (jika sudah diverifikasi)

---

## 🎨 UI/UX Features

### Badge Status

**Status Pembayaran:**
- 🟢 **LUNAS** - Hijau
- 🟡 **BELUM DIBAYAR** - Kuning
- 🔴 **DIBATALKAN** - Merah

**Status Verifikasi:**
- 🟡 **MENUNGGU** - Kuning
- 🟢 **DISETUJUI** - Hijau
- 🔴 **DITOLAK** - Merah

### Format Mata Uang
Semua nilai mata uang ditampilkan dalam format Rupiah:
```
Rp 135.000
```

### Responsive Design
- Tabel responsive dengan horizontal scroll pada layar kecil
- Grid layout yang menyesuaikan dengan ukuran layar
- Mobile-friendly form dengan input yang mudah digunakan

---

## 🚀 Alur Penggunaan

### 1. Membuat Transaksi (Petugas Pendaftaran)

1. Login sebagai **Petugas Pendaftaran**
   - Username: `pendaftaran`
   - Password: `pendaftaran123`

2. Klik menu **"Transaksi Pembayaran"** di navbar

3. Klik tombol **"Transaksi Baru"**

4. Pilih kunjungan dari dropdown
   - Hanya kunjungan yang sudah selesai yang muncul

5. Sistem otomatis menghitung biaya:
   - Cek rincian biaya yang muncul
   - Tambahkan diskon jika diperlukan

6. Pilih metode pembayaran

7. Tambahkan keterangan (opsional)

8. Klik **"Simpan Transaksi"**

9. Transaksi berhasil dibuat dengan status verifikasi **"Menunggu"**

### 2. Memverifikasi Transaksi (Kepala Puskesmas)

1. Login sebagai **Kepala Puskesmas**
   - Username: `kepalapuskesmas`
   - Password: `kepala123`

2. Klik menu **"Verifikasi Pembayaran"** di navbar

3. Lihat daftar transaksi yang perlu diverifikasi

4. Klik link nomor transaksi untuk melihat detail

5. Review detail pembayaran:
   - Data pasien
   - Rincian biaya lengkap
   - Metode pembayaran
   - Kasir yang melayani

6. Tambahkan catatan verifikasi (wajib untuk penolakan)

7. Klik tombol:
   - **"Setujui"** - jika pembayaran sesuai
   - **"Tolak"** - jika ada yang tidak sesuai

8. Konfirmasi keputusan

9. Status verifikasi terupdate di database

### 3. Melihat Laporan (Admin)

1. Login sebagai **Admin**
   - Username: `admin`
   - Password: `admin123`

2. Akses menu **"Transaksi Pembayaran"**

3. Filter berdasarkan:
   - Status pembayaran
   - Status verifikasi

4. Gunakan fitur pencarian untuk menemukan transaksi spesifik

---

## 📊 Data Seed yang Tersedia

Sistem sudah dilengkapi dengan 6 data transaksi contoh:

1. **TRX/202512/0001** - Lunas, Disetujui (Tunai)
2. **TRX/202512/0002** - Lunas, Disetujui (Transfer)
3. **TRX/202512/0003** - Lunas, Menunggu Verifikasi (Tunai)
4. **TRX/202512/0004** - Lunas, Menunggu Verifikasi (BPJS - Full Diskon)
5. **TRX/202512/0005** - Lunas, Ditolak (Debit - Diskon bermasalah)
6. **TRX/202512/0006** - Belum Dibayar, Menunggu (Tunai)

---

## 🔐 Role-Based Access Control

| Role | GET List | GET Detail | Create | Verify | Update | Delete |
|------|----------|------------|--------|--------|--------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pendaftaran | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Kepala Puskesmas | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Dokter | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Apoteker | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Pasien | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🧪 Testing Guide

### Test Case 1: Membuat Transaksi Baru
1. Login sebagai Pendaftaran
2. Buat transaksi untuk kunjungan yang ada
3. Verifikasi total biaya dihitung dengan benar
4. Cek nomor transaksi ter-generate otomatis
5. Pastikan status "Menunggu Verifikasi"

### Test Case 2: Verifikasi Setuju
1. Login sebagai Kepala Puskesmas
2. Pilih transaksi dengan status "Menunggu"
3. Review detail
4. Setujui dengan catatan
5. Verifikasi status berubah jadi "Disetujui"

### Test Case 3: Verifikasi Tolak
1. Login sebagai Kepala Puskesmas
2. Pilih transaksi dengan status "Menunggu"
3. Tolak dengan catatan alasan
4. Verifikasi status berubah jadi "Ditolak"

### Test Case 4: Filter dan Pencarian
1. Login dengan role yang punya akses
2. Test filter status pembayaran
3. Test filter status verifikasi
4. Test pencarian berdasarkan nomor transaksi
5. Test pencarian berdasarkan nama pasien

---

## 🐛 Troubleshooting

### Transaksi tidak bisa dibuat
- **Kemungkinan:** Kunjungan belum selesai
- **Solusi:** Pastikan status kunjungan adalah "selesai" atau "farmasi"

### Dropdown kunjungan kosong
- **Kemungkinan:** Belum ada kunjungan yang selesai atau sudah ada transaksi
- **Solusi:** Buat kunjungan baru dan set status ke "selesai"

### Biaya obat tidak muncul
- **Kemungkinan:** Belum ada resep untuk kunjungan tersebut
- **Solusi:** Buat resep terlebih dahulu melalui modul rekam medis

### Error saat verifikasi
- **Kemungkinan:** Catatan kosong saat menolak
- **Solusi:** Catatan wajib diisi saat menolak transaksi

---

## 📱 Menu Navigation

### Navbar - Petugas Pendaftaran
```
Dashboard | Kelola Data Pasien | Kunjungan | Transaksi Pembayaran
```

### Navbar - Kepala Puskesmas
```
Dashboard | Statistik Pelayanan | Verifikasi Pembayaran
```

---

## 🔄 Auto-Calculation Logic

### Biaya Pendaftaran
```typescript
const biayaPendaftaran = 10000; // Fixed
```

### Biaya Pemeriksaan
```typescript
const biayaPemeriksaan = 50000; // Fixed
```

### Biaya Obat
```typescript
// Dihitung dari resep
biayaObat = SUM(resepDetail.jumlah * obat.harga)
```

### Total Biaya
```typescript
totalBiaya = biayaPendaftaran + biayaPemeriksaan + biayaObat + biayaTindakan - diskon
```

---

## 📝 File Structure

```
backend/
├── src/
│   ├── entities/
│   │   └── Transaksi.ts          # Entity & Enums
│   ├── controllers/
│   │   └── transaksiController.ts # Business Logic
│   ├── routes/
│   │   └── transaksiRoutes.ts    # API Routes
│   ├── config/
│   │   └── database.ts           # Database Config (includes Transaksi)
│   └── utils/
│       └── seed.ts               # Seed Data (includes 6 transaksi)

frontend/
└── src/
    ├── pages/
    │   └── Transaksi/
    │       ├── TransaksiList.tsx   # List & Filter
    │       ├── TransaksiForm.tsx   # Create New
    │       └── TransaksiDetail.tsx # Detail & Verify
    ├── types/
    │   └── index.ts              # TypeScript Interfaces
    ├── components/
    │   └── Navbar.tsx            # Updated Menu
    └── App.tsx                   # Updated Routes
```

---

## ✅ Checklist Implementation

- [x] Database Entity (Transaksi)
- [x] Enums (MetodePembayaran, StatusPembayaran, StatusVerifikasi)
- [x] Backend Controllers (8 functions)
- [x] Backend Routes (6 endpoints)
- [x] Database Config Update
- [x] Seed Data (6 sample transactions)
- [x] Frontend Types
- [x] TransaksiList Component
- [x] TransaksiForm Component
- [x] TransaksiDetail Component
- [x] Navbar Menu Update
- [x] App Routing Update
- [x] Role-Based Access Control
- [x] Auto-calculation Logic
- [x] Currency Formatting
- [x] Status Badges
- [x] Responsive Design
- [x] Verification Workflow

---

## 🎯 Future Enhancements (Optional)

1. **Export Laporan**
   - Export to PDF
   - Export to Excel

2. **Notifikasi**
   - Email notifikasi ke Kepala saat ada transaksi baru
   - Push notification saat verifikasi selesai

3. **History Log**
   - Track perubahan status
   - Audit trail

4. **Dashboard Analytics**
   - Grafik pendapatan harian/bulanan
   - Statistik metode pembayaran
   - Persentase verifikasi

5. **Cetak Kwitansi**
   - Generate kwitansi PDF
   - Print langsung dari browser

6. **Reminder**
   - Reminder untuk transaksi belum dibayar
   - Reminder verifikasi pending

---

## 🆘 Support

Jika mengalami kendala, periksa:
1. Backend running di `http://localhost:5000`
2. Frontend running di `http://localhost:3000`
3. Database connection active
4. Seed data sudah ter-load
5. Login dengan role yang benar

---

**Dibuat pada:** 15 Desember 2024  
**Versi:** 1.0.0
