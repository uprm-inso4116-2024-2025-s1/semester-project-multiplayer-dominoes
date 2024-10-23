import { Router } from 'express';
import authenticateJWT from '../middleware/authenticateJWT.js'

export default (container) => {
    const router = Router();
    const usersHandler = container.UsersHandler;
    const usersController = container.UsersController;

    router.post('/register', async (req, res) => usersController.createUser(req, res));
    router.post('/login', async (req, res) => usersController.loginUser(req, res));
    router.post('/logout', authenticateJWT, async (req, res) => {
        try {
            const userId = req.user.id;
            await usersHandler.logoutUser(userId);
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};