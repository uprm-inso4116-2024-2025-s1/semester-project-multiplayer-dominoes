import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../index.js';
import crypto from 'crypto';
import UserModel from '../models/UserModel.js';


// Middleware to authenticate and verify JWT token
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await UserModel.findById(decoded.id); // Make sure UserModel is correct

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user; // Attach the user to the request object
            next();
        } catch (err) {
            console.error('Error verifying token:', err.message);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};


export default authenticateJWT;
