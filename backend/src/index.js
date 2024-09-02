import express from 'express';
import dotenv from 'dotenv';
import HealthCheckController from './controllers/HealthCheckController.js';

// Load environment variables
dotenv.config();

// Create an express application
const app = express();
const port = process.env.PORT || 3000;

// Register middlewares
app.use(express.json());

// Create Controllers
const healthCheckController = new HealthCheckController();

// Register endpoints
app.get('/healthz', healthCheckController.index);

// Run server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
