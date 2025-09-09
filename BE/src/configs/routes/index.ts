import { Router } from 'express';
import CmsRouting from '@configs/routes/cms/index';
import UserRouting from '@configs/routes/client/index';
import UploadRouting from '@configs/routes/Uploaders';

const router = Router();

router.use('/cms', CmsRouting);
router.use('/client', UserRouting);
router.use('/uploads', UploadRouting);

export default router;
