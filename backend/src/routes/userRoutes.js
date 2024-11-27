import { Router } from "express";


export default (container) => {
    const router = Router();
    const usersController = container.UsersController;

    router.get('/', async (req, res) => usersController.getAllUsers(req, res));
    router.post('/', async (req, res) => usersController.createUser(req, res));

    return router;
};