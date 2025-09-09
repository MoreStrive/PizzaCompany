import { Router } from 'express';
import OrderController from '@controllers/client/OrderController';

const router = Router();

router.get('/', OrderController.index);
router.get('/:orderId', OrderController.show);
router.post('/', OrderController.create);
router.patch('/change-status/:orderId', OrderController.updateStatus);
// router.get('/export-to-email/:orderId', OrderController.exportToEmail);

export default router;
