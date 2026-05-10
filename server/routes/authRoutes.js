import express from 'express';
import { 
    isAuthenticated, 
    login, 
    logout, 
    register, 
    resetPassword, 
    sendResetOtp, 
    resendOtp, 
    verifyEmail, 
    githubAuth, 
    githubCallback 
} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/resend-otp', resendOtp); 
authRouter.post('/verify-account', verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

// GitHub OAuth Routes
authRouter.get('/github', githubAuth);
authRouter.get('/github/callback', githubCallback);

export default authRouter;