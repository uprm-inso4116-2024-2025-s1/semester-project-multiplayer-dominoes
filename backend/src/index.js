import express from 'express';
import dotenv from 'dotenv';
import createMongoDbConnection from './database/MongoDbConnection.js';

import HealthCheckController from './controllers/HealthCheckController.js';
import UsersController from './controllers/UsersController.js';

import UsersHandler from './handlers/UsersHandler.js';
import authenticateJWT from './middleware/authenticateJWT.js';

// Load environment variables
dotenv.config();

// Setup database connection
createMongoDbConnection(process.env.MONGODB_URI);

// Create an express application
const app = express();
const port = process.env.PORT || 8080;

// Register middlewares
app.use(express.json());

// Create Handlers
const usersHandler = new UsersHandler();

// Create Controllers
const healthCheckController = new HealthCheckController();
const usersController = new UsersController(usersHandler);

// Register endpoints
app.get('/', (req, res) => res.send('Welcome to Multiplayer Dominoes backend!'));
app.get('/healthz', async (req, res) => healthCheckController.index(req, res));
app.get('/users', async (req, res) => usersController.getAllUsers(req, res));
app.post('/users', async (req, res) => usersController.createUser(req, res));
app.post('/login', async (req, res) => usersController.loginUser(req, res));
app.post('/register', async (req, res) => usersController.createUser(req, res));
app.post('/logout', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        await usersHandler.logoutUser(userId);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Run server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default app;