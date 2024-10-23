import healthzRoutes from './healthzRoutes.js';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';

export default (app, container) => {
    app.get('/', (req, res) => res.send('Welcome to Multiplayer Dominoes backend!'));
    
    // Register healthz routes
    app.use('/healthz', healthzRoutes(container));

    // Register user routes
    app.use('/users', userRoutes(container));

    // Register auth routes
    app.use('/', authRoutes(container));
};