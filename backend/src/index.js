import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import createMongoDbConnection from './database/MongoDbConnection.js';
import HealthCheckController from './controllers/HealthCheckController.js';
import UsersController from './controllers/UsersController.js';
import container from './di/container.js';
import routes from './routes/index.js';
import MongoDbConnection from './database/MongoDbConnection.js';

// Load environment variables
dotenv.config();

import authenticateJWT from './middleware/authenticateJWT.js';
import UsersHandler from './handlers/UsersHandler.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
// Setup database connection
createMongoDbConnection(process.env.MONGODB_URI);

// Create an express application
const app = express();
const port = process.env.PORT || 8080;

// Setup database connection
MongoDbConnection.createConnection(process.env.MONGODB_URI);

// Register middlewares
app.use(cors());
app.use(express.json());


// Create Handlers
const usersHandler = new UsersHandler();

// Create Controllers
const healthCheckController = new HealthCheckController();
const usersController = new UsersController(usersHandler);

// Register endpoints
routes(app, container);

// Run server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default app;
