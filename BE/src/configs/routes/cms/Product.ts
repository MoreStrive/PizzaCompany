import { Router } from 'express';
import ProductController from '@controllers/cms/ProductController';

const router = Router();

router.get('/', ProductController.index);
router.get('/get-all', ProductController.getAll);
router.get('/:productId', ProductController.show);
router.patch('/update-count/:productId', ProductController.updateCountProduct);
router.patch('/change-status/:productId', ProductController.updateStatus);
router.post('/', ProductController.create);
router.patch('/:productId', ProductController.update);
router.delete('/:productId', ProductController.delete);

export default router;
