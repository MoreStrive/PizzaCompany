import { Router } from 'express';
import SessionController from '@controllers/cms/SessionController';
import { actorPassport } from '@middlewares/passport';

const router = Router();

router.post('/login', SessionController.login);
router.get('/get-current-actor', actorPassport.authenticate('jwt', { session: false }), SessionController.getCurrentActor);
router.post('/verify-email', actorPassport.authenticate('jwt', { session: false }), SessionController.verifyEmail);
router.post('/send-back-otp', actorPassport.authenticate('jwt', { session: false }), SessionController.sendBackOtp);
// router.patch('/', actorPassport.authenticate('jwt', { session: false }), SessionController.update);
router.patch('/change-password', actorPassport.authenticate('jwt', { session: false }), SessionController.changePassword);
router.post('/forgot-password', actorPassport.authenticate('jwt', { session: false }), SessionController.forgotPassword);
router.post('/verify-otp', actorPassport.authenticate('jwt', { session: false }), SessionController.verifyOtp);
router.post('/reset-password/:actorId', actorPassport.authenticate('jwt', { session: false }), SessionController.resetPassword);
// router.post('/', SessionController.register);

export default router;
