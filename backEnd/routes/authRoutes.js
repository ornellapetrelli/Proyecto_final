import express from 'express';
import { registerUserController, loginController, verifyMailValidationTokenController,  forgotPasswordController, resetPasswordController } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUserController); 
router.post('/login', loginController); 
router.get('/verify/:verification_token', verifyMailValidationTokenController); 
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);

export default router;
