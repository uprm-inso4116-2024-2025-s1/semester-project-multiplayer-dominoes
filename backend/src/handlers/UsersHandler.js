import { v4 as uuidv4 } from 'uuid'; // Import the UUID package
import UserModel from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key';
export default class UsersHandler {
    async getAllUsers() {
        return await UserModel.find();
    }

    async createUser(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = new UserModel({
            username: data.username,
            email: data.email,
            password: hashedPassword,
            uuid: uuidv4() // Generate a unique UUID for the user
        });
        return await user.save();
    }
    async findUserByEmail(email) {
        return await UserModel.findOne({ email });
    }
    async findUserByUsername(username) {
        return await UserModel.findOne({ username });
    }
    async findUserById(id) {
        return await UserModel.findById(id); 
    }
    
    

    async validatePassword(inputPassword, storedPassword) {
        return await bcrypt.compare(inputPassword, storedPassword);
    }
    generateToken(user) {
        return jwt.sign(
            { id: user._id, email: user.email, tokenVersion: user.tokenVersion },  // Payload
            JWT_SECRET,  // Secret key
            { expiresIn: '1h' }  // Token expiration
        );
    }
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await UserModel.findById(decoded.id);

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
        return await UserModel.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
    }

    generateResetToken(user) {
        return jwt.sign(
            { id: user._id, email: user.email },  // Payload
            JWT_SECRET,  // Secret key
            { expiresIn: '1h' }  // Token válido por 1 hora
        );
    }
    
    
};