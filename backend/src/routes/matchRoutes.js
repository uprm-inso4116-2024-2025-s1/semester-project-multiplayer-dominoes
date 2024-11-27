import { Router } from "express";

export default (container) => {
    const router = Router();
    const matchController = container.MatchController;

    router.get('/', async (req, res) => matchController.getAllMatches(req, res));
    router.post('/', async (req, res) => matchController.createMatch(req, res));
    router.put('/:id', async (req, res) => matchController.updateMatch(req, res));

    return router;
};