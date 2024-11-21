import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import container from './di/container.js';
import routes from './routes/index.js';
import MongoDbConnection from './database/MongoDbConnection.js';

// Load environment variables
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required but not found.');
}
export const JWT_SECRET = process.env.JWT_SECRET;
// Create an express application
const app = express();
const port = process.env.PORT || 8080;

// Setup database connection
MongoDbConnection.createConnection(process.env.MONGODB_URI);

// Register middlewares
app.use(cors());
app.use(express.json());

// Register endpoints
routes(app, container);

// Run server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default app;
