import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create an express application
const app = express();
const port = process.env.PORT || 3000;

// Register middlewares
app.use(express.json());

// Register endpoints
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
