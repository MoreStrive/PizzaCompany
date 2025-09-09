import { Router } from 'express';
import RatingController from '@controllers/cms/RatingController';

const router = Router();

router.get('/:productId', RatingController.index);
router.patch('/:ratingId', RatingController.update);
router.delete('/:ratingId', RatingController.delete);

export default router;
