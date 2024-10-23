import { Router } from "express";

export default (container) => {
    const router = Router();
    const healthCheckController = container.HealthCheckController;

    router.get('/', async (req, res) => healthCheckController.index(req, res));

    return router;
};