import { Router } from 'express';
import authenticateJWT from '../middleware/authenticateJWT.js'

export default (container) => {
    const router = Router();
    const usersController = container.UsersController;

    router.post('/register', async (req, res) => usersController.createUser(req, res));
    router.post('/login', async (req, res) => usersController.loginUser(req, res));
    router.post('/logout', authenticateJWT, async (req, res) => usersController.logoutUser(req, res));

    return router;
};