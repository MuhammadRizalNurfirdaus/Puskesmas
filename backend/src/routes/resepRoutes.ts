import { Router } from 'express';
import { getAllResep, getResepById, createResep, updateResepStatus } from '../controllers/resepController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '../entities/User';

const router = Router();

router.use(authenticate);

router.get('/', getAllResep);
router.get('/:id', getResepById);
router.post('/', authorize(UserRole.ADMIN, UserRole.DOKTER), createResep);
router.put('/:id/status', authorize(UserRole.ADMIN, UserRole.APOTEKER), updateResepStatus);

export default router;
