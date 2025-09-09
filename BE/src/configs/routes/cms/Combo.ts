import { Router } from 'express';
import ComboController from '@controllers/cms/ComboController';

const router = Router();

router.get('/', ComboController.index);
router.get('/:comboId', ComboController.show);
router.post('/', ComboController.create);
router.patch('/:comboId', ComboController.update);
// router.patch('/update-count/:comboId', ComboController.updateCount);
router.patch('/change-status/:comboId', ComboController.updateStatus);
router.delete('/:comboId', ComboController.delete);

export default router;
