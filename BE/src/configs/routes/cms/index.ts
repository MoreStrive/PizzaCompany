import { Router } from 'express';
import { actorPassport } from '@middlewares/passport';

import ComboRouting from './Combo';
import ContactRouting from './Contact';
import DiscountRouting from './Discount';
import OrderRouting from './Order';
import ProductRouting from './Product';
import RatingRouting from './Rating';
import SesstionRouting from './Session';
import ManageRouting from './Manage';
import UserRouting from './User';
import SettingRouting from './Setting';
import CategoryRouter from './Category';
import MaterialRouter from './Material';
import MaterialHistoryRouter from './MaterialHistory';
import DashboardRouter from './Dashboard';

const router = Router();

router.use('/combos', actorPassport.authenticate('jwt', { session: false }), ComboRouting);
router.use('/contacts', actorPassport.authenticate('jwt', { session: false }), ContactRouting);
router.use('/discounts', actorPassport.authenticate('jwt', { session: false }), DiscountRouting);
router.use('/orders', actorPassport.authenticate('jwt', { session: false }), OrderRouting);
router.use('/products', actorPassport.authenticate('jwt', { session: false }), ProductRouting);
router.use('/ratings', actorPassport.authenticate('jwt', { session: false }), RatingRouting);
router.use('/settings', actorPassport.authenticate('jwt', { session: false }), SettingRouting);
router.use('/manage', actorPassport.authenticate('jwt', { session: false }), ManageRouting);
router.use('/users', actorPassport.authenticate('jwt', { session: false }), UserRouting);
router.use('/categories', actorPassport.authenticate('jwt', { session: false }), CategoryRouter);
router.use('/materials', actorPassport.authenticate('jwt', { session: false }), MaterialRouter);
router.use('/materials-histories', actorPassport.authenticate('jwt', { session: false }), MaterialHistoryRouter);
router.use('/dashboard', actorPassport.authenticate('jwt', { session: false }), DashboardRouter);
router.use('/sessions', SesstionRouting);

export default router;
