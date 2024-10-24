import { Router } from 'express';
import authenticateJWT from '../middleware/authenticateJWT.js'

export default (container) => {
    const router = Router();
    const usersController = container.UsersController;

    router.post('/register', async (req, res) => usersController.createUser(req, res));
    router.post('/login', async (req, res) => usersController.loginUser(req, res));
    router.post('/logout', authenticateJWT, async (req, res) => usersController.logoutUser(req, res));
    router.post('/forgot-password', async (req, res) => usersController.requestPasswordReset(req, res));
    router.post('/reset-password', async (req, res) => usersController.resetPassword(req, res));

    return router;
};