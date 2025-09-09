import { Router } from 'express';
import DiscountController from '@controllers/cms/DiscountController';

const router = Router();

router.get('/', DiscountController.index);
router.post('/', DiscountController.create);
router.patch('/:discountId', DiscountController.update);
router.delete('/:discountId', DiscountController.delete);

export default router;
