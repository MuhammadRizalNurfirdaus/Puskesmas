import { Router } from 'express';
import { getAllKunjungan, getKunjunganById, createKunjungan, updateKunjunganStatus } from '../controllers/kunjunganController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '../entities/User';

const router = Router();

router.use(authenticate);

router.get('/', getAllKunjungan);
router.get('/:id', getKunjunganById);
router.post('/', authorize(UserRole.ADMIN, UserRole.PENDAFTARAN), createKunjungan);
router.put('/:id/status', authorize(UserRole.ADMIN, UserRole.PENDAFTARAN, UserRole.DOKTER, UserRole.APOTEKER), updateKunjunganStatus);

export default router;
