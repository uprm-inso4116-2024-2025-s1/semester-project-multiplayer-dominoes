import { v4 as uuidv4 } from 'uuid'; // Import the UUID package
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../index.js';

export default class UsersHandler {
    #userRepository;

    constructor(userRepository) {
        this.#userRepository = userRepository;
    }

    async getAllUsers() {
        return await this.#userRepository.getAllUsers();
    }

    async findUserByEmail(email) {
        return await this.#userRepository.findUserByEmail(email);
    }

    async findUserByUsername(username) {
        return await this.#userRepository.findUserByUsername(username);
    }

    async createUser(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userObject = {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            uuid: uuidv4(), // Generate a unique UUID for the user
            role: data.role || 'user',
        };
        return await this.#userRepository.createUser(userObject);
    }

    async findUserById(id) {
        return await this.#userRepository.findUserById(id); 
    }

    async validatePassword(inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword);
    }

    generateToken(user) {
        const expiresIn = user.role === 'admin' ? '15m' : '1h';

        return jwt.sign(
            { id: user._id, email: user.email, role: user.role, tokenVersion: user.tokenVersion },  // Payload
            JWT_SECRET, 
            { expiresIn } 
        );
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await this.#userRepository.findUserById(decoded.id);

            // Check if the token version matches the user's current tokenVersion
            if (!user || decoded.tokenVersion !== user.tokenVersion) {
                console.error('Error: Token version mismatch or user not found');
                throw new Error('Token version mismatch or user not found');
            }

            return user;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                console.error('Error: Token has expired');
                throw new Error('Token expired. Please login again.');
            } else if (error instanceof jwt.JsonWebTokenError) {
                console.error('Error: Invalid token');
                throw new Error('Invalid token. Authorization denied.');
            } else {
                console.error('Error: Token verification failed', error.message);
                throw new Error('Internal error during token verification.');
            }
        }
    }

    async logoutUser(userId) {
        return await this.#userRepository.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
    }

    generateResetToken(user) {
        return jwt.sign(
            { id: user._id, email: user.email },  
            JWT_SECRET, 
            { expiresIn: '15m' }
        );
    }
};
