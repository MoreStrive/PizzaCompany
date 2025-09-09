import { Router } from 'express';
import ContactController from '@controllers/client/ContactController';

const router = Router();

router.post('/', ContactController.create);

export default router;
