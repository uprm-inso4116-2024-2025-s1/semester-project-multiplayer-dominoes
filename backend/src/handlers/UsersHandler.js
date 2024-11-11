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
            uuid: uuidv4() // Generate a unique UUID for the user
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
        return jwt.sign(
            { id: user._id, email: user.email, tokenVersion: user.tokenVersion },  // Payload
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );
    }
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await this.#userRepository.findUserById(decoded.id);

            // Check if the token version matches the user's current tokenVersion
            if (decoded.tokenVersion !== user.tokenVersion) {
                throw new Error('Token version mismatch');
            }

            return user;
        } catch (error) {
            throw new Error('Invalid token');
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