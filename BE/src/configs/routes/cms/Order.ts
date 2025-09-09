import { Router } from 'express';
import OrderController from '@controllers/cms/OrderController';

const router = Router();

router.get('/', OrderController.index);
router.get('/:orderId', OrderController.show);
// router.post('/', OrderController.create);
router.patch('/:orderId', OrderController.updateStatus);
router.post('/export-email/:orderId', OrderController.exportToEmail);

export default router;
