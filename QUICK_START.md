# 🚀 Quick Start Guide - Sistem Puskesmas

## ⚠️ PENTING: Setup Database Terlebih Dahulu!

Sebelum menjalankan aplikasi, Anda HARUS setup database terlebih dahulu.

### Langkah 1: Setup Database

Jalankan perintah berikut:

```bash
sudo mariadb
```

Kemudian copy-paste SQL commands berikut (semua sekaligus):

```sql
CREATE DATABASE IF NOT EXISTS puskesmas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'puskesmas_user'@'localhost' IDENTIFIED BY 'puskesmas123';
GRANT ALL PRIVILEGES ON puskesmas_db.* TO 'puskesmas_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Langkah 2: Verifikasi Database Setup

Test koneksi database dengan perintah:

```bash
mariadb -u puskesmas_user -p'puskesmas123' puskesmas_db -e "SELECT 'Database Ready!' as Status;"
```

Jika muncul "Database Ready!", database sudah siap! ✅

### Langkah 3: Jalankan Aplikasi

#### Cara Otomatis (Recommended):
```bash
./start-app.sh
```

#### Cara Manual:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (buka terminal baru)
cd frontend
npm run dev
```

### Langkah 4: Akses Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Login Credentials

Gunakan salah satu akun berikut untuk login:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Pendaftaran | pendaftaran | pendaftaran123 |
| Dokter | dokter | dokter123 |
| Apoteker | apoteker | apoteker123 |
| Kepala Puskesmas | kepala | kepala123 |

---

## 🛑 Untuk Stop Aplikasi

```bash
./stop-app.sh
```

Atau manual dengan `Ctrl+C` di masing-masing terminal.

---

## 📝 Troubleshooting

### Port sudah digunakan?
```bash
# Kill process di port 5000 (backend)
sudo lsof -ti:5000 | xargs -r sudo kill -9

# Kill process di port 5173 (frontend)
sudo lsof -ti:5173 | xargs -r sudo kill -9
```

### Database connection error?
- Pastikan MariaDB running: `sudo systemctl status mariadb`
- Cek kredensial di `backend/.env`
- Ulang setup database (Langkah 1-2)

### Dependencies error?
```bash
# Install ulang dependencies
cd backend && npm install
cd ../frontend && npm install
```

---

## 📚 Dokumentasi Lengkap

- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Panduan lengkap setup database
- [README.md](README.md) - Dokumentasi lengkap aplikasi
- [setup-db-commands.txt](setup-db-commands.txt) - Quick reference SQL commands

---

## ✅ Checklist Setup

- [ ] MariaDB/MySQL sudah terinstall dan running
- [ ] Node.js v18+ sudah terinstall
- [ ] Dependencies sudah terinstall (`npm install`)
- [ ] Database sudah dibuat (Langkah 1)
- [ ] Database connection berhasil (Langkah 2)
- [ ] Aplikasi berjalan tanpa error (Langkah 3)

Jika semua checklist sudah ✅, aplikasi siap digunakan! 🎉
