import { Router } from 'express';
import RatingController from '@controllers/client/RatingController';
import { userPassport } from '@middlewares/passport';

const router = Router();

router.get('/:productId', RatingController.index);
router.post('/:productId', userPassport.authenticate('jwt', { session: false }), RatingController.create);

export default router;
