import { Router } from 'express';
import { getAllObat, getObatById, createObat, updateObat, updateStokObat } from '../controllers/obatController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '../entities/User';

const router = Router();

router.use(authenticate);

router.get('/', getAllObat);
router.get('/:id', getObatById);
router.post('/', authorize(UserRole.ADMIN, UserRole.APOTEKER), createObat);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.APOTEKER), updateObat);
router.put('/:id/stok', authorize(UserRole.ADMIN, UserRole.APOTEKER), updateStokObat);

export default router;
