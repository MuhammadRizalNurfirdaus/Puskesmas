import { Router } from 'express';
import { getLaporanKunjungan, getStatistikPasien, getLaporanStokObat, getDashboardData } from '../controllers/laporanController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '../entities/User';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboardData);
router.get('/kunjungan', getLaporanKunjungan);
router.get('/pasien', getStatistikPasien);
router.get('/obat', getLaporanStokObat);

export default router;
