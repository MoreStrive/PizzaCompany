import { Router } from 'express';
import ProductController from '@controllers/client/ProductController';

const router = Router();

router.get('/', ProductController.index);
router.get('/get-all', ProductController.getAll);
router.get('/:productId', ProductController.show);

export default router;
