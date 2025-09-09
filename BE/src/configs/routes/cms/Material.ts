import { Router } from 'express';
import MaterialController from '@controllers/cms/MaterialController';

const router = Router();

router.get('/', MaterialController.index);
router.get('/:materialId', MaterialController.show);
router.post('/', MaterialController.create);
router.patch('/:materialId', MaterialController.update);
router.delete('/:materialId', MaterialController.delete);

export default router;
