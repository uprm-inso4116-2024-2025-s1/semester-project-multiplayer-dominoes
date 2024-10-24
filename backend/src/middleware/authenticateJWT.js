import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../index.js';
import crypto from 'crypto';


// Middleware to authenticate and verify JWT token
const authenticateJWT = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        console.warn('Warning: JWT_SECRET environment variable not found. Using default secret key.');
    }
    const authHeader = req.headers.authorization; // Get token from Authorization header

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract token part after 'Bearer'

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.error('Error: Token has expired');
                    return res.status(401).json({ message: 'Token expired. Please login again.' });
                } else if (err.name === 'JsonWebTokenError') {
                    console.error('Error: Invalid token');
                    return res.status(401).json({ message: 'Invalid token. Authorization denied.' });
                } else if (err.name === 'NotBeforeError') {
                    console.error('Error: Token not active yet');
                    return res.status(401).json({ message: 'Token not active. Please wait before trying again.' });
                } else {
                    console.error('Error: Token verification failed', err);
                    return res.status(500).json({ message: 'Internal server error during token verification.' });
                }
            }

            req.user = user; // Attach the decoded user data to req.user
            next(); // Continue to the next middleware or route handler
        });
    } else {
        console.error('Error: No token provided');
        return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }
};

export default authenticateJWT;
