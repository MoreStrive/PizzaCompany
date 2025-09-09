import { Router } from 'express';
import SettingController from '@controllers/cms/SettingsController';

const router = Router();

router.get('/', SettingController.show);
router.patch('/', SettingController.update);

export default router;
