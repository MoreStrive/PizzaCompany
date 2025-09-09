import { Router } from 'express';
import ComboController from '@controllers/client/ComboController';

const router = Router();

router.get('/', ComboController.index);
router.get('/:comboId', ComboController.show);

export default router;
