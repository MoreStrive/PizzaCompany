import { Router } from 'express';
import UserController from '@controllers/cms/UserController';

const router = Router();

router.get('/', UserController.index);
router.get('/:userId', UserController.show);
router.post('/', UserController.registerUser);
router.patch('/:userId', UserController.update);
router.delete('/:userId', UserController.delete);

export default router;
