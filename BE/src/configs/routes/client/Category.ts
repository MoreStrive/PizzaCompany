import { Router } from 'express';
import CategoryController from '@controllers/client/CategoryController';

const router = Router();

router.get('/', CategoryController.index);
router.get('/:categoryId', CategoryController.show);

export default router;
