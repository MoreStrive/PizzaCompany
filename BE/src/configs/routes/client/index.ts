import { Router } from 'express';
import { userPassport } from '@middlewares/passport';

import CartRouting from './Cart';
import ComboRouting from './Combo';
import ContactRouting from './Contact';
import DiscountRouting from './Discount';
import OrderRouting from './Order';
import ProductRouting from './Product';
import RatingRouting from './Rating';
import SesstionRouting from './Session';
import SettingRouting from './Setting';
import CategoryRouter from './Category';

const router = Router();

router.use('/carts', userPassport.authenticate('jwt', { session: false }), CartRouting);
router.use('/combos', ComboRouting);
router.use('/contacts', ContactRouting);
router.use('/discounts', userPassport.authenticate('jwt', { session: false }), DiscountRouting);
router.use('/orders', userPassport.authenticate('jwt', { session: false }), OrderRouting);
router.use('/categories', CategoryRouter);
router.use('/products', ProductRouting);
router.use('/ratings', RatingRouting);
router.use('/sessions', SesstionRouting);
router.use('/settings', SettingRouting);

export default router;
