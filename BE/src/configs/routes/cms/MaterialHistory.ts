import { Router } from 'express';
import MaterialHistoryController from '@controllers/cms/MaterialHistoryController';

const router = Router();

router.get('/:materialId', MaterialHistoryController.index);
router.post('/', MaterialHistoryController.create);

export default router;
