import { Router } from 'express';
import { getLaporanKunjungan, getStatistikPasien, getLaporanStokObat, getDashboardData } from '../controllers/laporanController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '../entities/User';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboardData);
router.get('/kunjungan', authorize(UserRole.ADMIN, UserRole.KEPALA_PUSKESMAS), getLaporanKunjungan);
router.get('/pasien', authorize(UserRole.ADMIN, UserRole.KEPALA_PUSKESMAS), getStatistikPasien);
router.get('/obat', authorize(UserRole.ADMIN, UserRole.KEPALA_PUSKESMAS, UserRole.APOTEKER), getLaporanStokObat);

export default router;
