import { Router } from 'express';
import authenticateJWT from '../middleware/authenticateJWT.js';
import rateLimit from 'express-rate-limit';

// Define rate limiting middleware
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many login attempts. Please try again later.',
});

// Define rate limiting middleware for password-related routes
const passwordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many password reset attempts. Please try again later.',
});

export default (container) => {
    const router = Router();
    const usersController = container.UsersController;

    router.post('/login', loginLimiter, async (req, res) => usersController.loginUser(req, res));

    router.post('/register', async (req, res) => usersController.createUser(req, res));
    router.post('/logout', authenticateJWT, async (req, res) => usersController.logoutUser(req, res));
  // Forgot-password route with rate limiter
  router.post('/forgot-password', passwordLimiter, async (req, res) => usersController.requestPasswordReset(req, res));

  // Reset-password route with rate limiter
  router.post('/reset-password', passwordLimiter, async (req, res) => usersController.resetPassword(req, res));

    return router;
};