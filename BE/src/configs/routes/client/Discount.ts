import { Router } from 'express';
import DiscountController from '@controllers/client/DiscountController';

const router = Router();

router.get('/', DiscountController.index);

export default router;
