import { Router } from 'express';
import CategoryController from '@controllers/cms/CategoryController';

const router = Router();

router.get('/', CategoryController.index);
router.get('/:categoryId', CategoryController.show);
router.post('/', CategoryController.create);
router.patch('/:categoryId', CategoryController.update);
router.delete('/:categoryId', CategoryController.delete);

export default router;
