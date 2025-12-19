import { Router } from 'express';
import { getRekamMedisByPasien, getRekamMedisById, createRekamMedis, updateRekamMedis } from '../controllers/rekamMedisController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '../entities/User';

const router = Router();

router.use(authenticate);

router.get('/pasien/:pasienId', getRekamMedisByPasien);
router.get('/:id', getRekamMedisById);
router.post('/', authorize(UserRole.ADMIN, UserRole.DOKTER), createRekamMedis);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.DOKTER), updateRekamMedis);

export default router;
