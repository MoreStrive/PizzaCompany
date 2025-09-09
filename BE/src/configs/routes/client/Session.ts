import { Router } from 'express';
import SessionController from '@controllers/client/SessionController';
import { userPassport } from '@middlewares/passport';

const router = Router();

router.post('/login', SessionController.login);
router.post('/register', SessionController.register);
router.get('/get-current-user', userPassport.authenticate('jwt', { session: false }), SessionController.getCurrentUser);
router.post('/verify-email', SessionController.verifyEmail);
router.post('/send-back-otp', SessionController.sendBackOtp);
router.patch('/', userPassport.authenticate('jwt', { session: false }), SessionController.update);
router.patch('/change-password', userPassport.authenticate('jwt', { session: false }), SessionController.changePassword);
router.post('/forgot-password', SessionController.forgotPassword);
router.post('/verify-otp', SessionController.verifyOtp);
router.post('/reset-password', SessionController.resetPassword);

export default router;
