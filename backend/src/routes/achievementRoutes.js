import { Router } from "express";

export default (container) => {
    const router = Router();
    const achievementController = container.AchievementController;

    router.get('/', async (req, res) => achievementController.getAllAchievements(req, res));
    router.post('/', async (req, res) => achievementController.createAchievement(req, res));
    router.put('/:id', async (req, res) => achievementController.updateAchievement(req, res));

    return router;
};