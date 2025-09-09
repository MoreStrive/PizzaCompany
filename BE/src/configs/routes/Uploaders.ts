import UploaderController from '@controllers/UploadersController';
import { withoutSavingUploader } from '@middlewares/uploaders';
import { Router } from 'express';

const router = Router();

router.post('/', withoutSavingUploader.any(), UploaderController.upload);

export default router;
