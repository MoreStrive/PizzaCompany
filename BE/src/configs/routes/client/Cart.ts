import { Router } from 'express';
import CartController from '@controllers/client/CartController';

const router = Router();

router.get('/:userId', CartController.show);
router.patch('/', CartController.update);

export default router;
