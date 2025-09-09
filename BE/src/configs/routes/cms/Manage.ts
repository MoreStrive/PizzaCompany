import { Router } from 'express';
import ManageController from '@controllers/cms/ManageController';

const router = Router();

router.get('/', ManageController.index);
router.get('/:staffId', ManageController.show);
router.post('/', ManageController.registerStaff);
router.patch('/:staffId', ManageController.update);
router.patch('/update-role/:staffId', ManageController.updateRole);
router.delete('/:staffId', ManageController.delete);

export default router;
