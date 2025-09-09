import { Router } from 'express';
import ContactController from '@controllers/cms/ContactController';

const router = Router();

router.get('/', ContactController.index);
router.patch('/:contactId', ContactController.update);

export default router;
