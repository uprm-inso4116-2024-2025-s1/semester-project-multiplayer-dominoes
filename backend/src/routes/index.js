import healthzRoutes from './healthzRoutes.js';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import matchRoutes from './matchRoutes.js';
import achievementRoutes from './achievementRoutes.js';
import { joinRoom, createRoom, getAllRooms } from "../controllers/RoomsController.js";

export default (app, container) => {
    app.get('/', (req, res) => res.send('Welcome to Multiplayer Dominoes backend!'));
    
    // Register healthz routes
    app.use('/healthz', healthzRoutes(container));

    // Register user routes
    app.use('/users', userRoutes(container));

    // Register auth routes
    app.use('/', authRoutes(container));

    // Register match routes
    app.use('/matches', matchRoutes(container));

    // Register room routes
    app.get('/rooms', getAllRooms);
    app.post('/rooms', createRoom);
    app.post('/rooms/:roomId/join', joinRoom);

    // Register achivement routes
    app.use('/achievements', achievementRoutes(container));
};