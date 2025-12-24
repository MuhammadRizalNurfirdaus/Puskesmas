import { Router } from 'express';
import { 
  getAllTransaksi, 
  getTransaksiById, 
  createTransaksi, 
  verifikasiTransaksi,
  updateTransaksi, 
  deleteTransaksi 
} from '../controllers/transaksiController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '../entities/User';

const router = Router();

router.use(authenticate);

// Get all transaksi - Semua user bisa akses (dengan filter di controller)
router.get('/', getAllTransaksi);

// Get transaksi by ID - Semua user bisa akses (dengan validasi di controller)
router.get('/:id', getTransaksiById);

// Create transaksi - Admin, Kasir, Pasien
router.post('/', authorize(UserRole.ADMIN, UserRole.PENDAFTARAN, UserRole.PASIEN), createTransaksi);

// Verifikasi transaksi - Kepala Puskesmas
router.patch('/:id/verifikasi', authorize(UserRole.ADMIN, UserRole.KEPALA_PUSKESMAS), verifikasiTransaksi);

// Update transaksi - Admin
router.put('/:id', authorize(UserRole.ADMIN), updateTransaksi);

// Delete transaksi - Admin
router.delete('/:id', authorize(UserRole.ADMIN), deleteTransaksi);

export default router;
