import { Router } from 'express';
import SettingController from '@controllers/client/SettingsController';

const router = Router();

router.get('/', SettingController.show);

export default router;
