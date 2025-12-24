import { Router } from 'express';
import { getAllPasien, getPasienById, createPasien, updatePasien } from '../controllers/pasienController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '../entities/User';

const router = Router();

router.use(authenticate);

router.get('/', authorize(UserRole.ADMIN, UserRole.PENDAFTARAN), getAllPasien);
router.get('/:id', authorize(UserRole.ADMIN, UserRole.PENDAFTARAN), getPasienById);
router.post('/', authorize(UserRole.ADMIN, UserRole.PENDAFTARAN), createPasien);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.PENDAFTARAN), updatePasien);

export default router;
