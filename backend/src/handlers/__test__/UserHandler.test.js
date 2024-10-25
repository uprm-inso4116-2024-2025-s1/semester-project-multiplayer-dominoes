import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import UserModel from '../../models/UserModel.js';
import UsersHandler from '../UsersHandler.js'; 

// use jest to mock dependancies
//we need to mock so that the functions do not interact with the production database
jest.mock('bcrypt');
jest.mock('uuid');
jest.mock('jsonwebtoken');
jest.mock('../../models/UserModel.js', () => {
    return {
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        prototype: {
            save: jest.fn(),
        },
    };
});

describe('UsersHandler', () => {
    let usersHandler;

    beforeEach(() => {
        usersHandler = new UsersHandler();
    });
    

    describe('findUserByEmail', () => {
        it('should find a user by email', async () => {
            const mockEmail = 'test@example.com';
            const mockUser = { username: 'testuser', email: mockEmail };

            UserModel.findOne.mockResolvedValue(mockUser);

            const result = await usersHandler.findUserByEmail(mockEmail);

            expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockEmail });
            expect(result).toEqual(mockUser);
        });
    });

    describe('findUserByUsername', () => {
        it('should find a user by username', async () => {
            const mockUsername = 'testuser';
            const mockUser = { username: mockUsername, email: 'test@example.com' };

            UserModel.findOne.mockResolvedValue(mockUser);

            const result = await usersHandler.findUserByUsername(mockUsername);

            expect(UserModel.findOne).toHaveBeenCalledWith({ username: mockUsername });
            expect(result).toEqual(mockUser);
        });
    });

    describe('validatePassword', () => {
        it('should validate the password', async () => {
            const inputPassword = 'plainPassword';
            const storedPassword = 'hashedPassword';
            bcrypt.compare.mockResolvedValue(true);

            const result = await usersHandler.validatePassword(inputPassword, storedPassword);

            expect(bcrypt.compare).toHaveBeenCalledWith(inputPassword, storedPassword);
            expect(result).toBe(true);
        });
    });

    describe('generateToken', () => {
        it('should generate a JWT token for the user', () => {
            const mockUser = { _id: 'userId', email: 'test@example.com', tokenVersion: 1 };
            const mockToken = 'mockedToken';
            jwt.sign.mockReturnValue(mockToken);

            const result = usersHandler.generateToken(mockUser);

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: mockUser._id, email: mockUser.email, tokenVersion: mockUser.tokenVersion },
                expect.any(String),
                { expiresIn: '1h' }
            );
            expect(result).toBe(mockToken);
        });
    });

    describe('verifyToken', () => {
        it('should verify a JWT token and return the user', async () => {
            const mockToken = 'mockedToken';
            const decoded = { id: 'userId', tokenVersion: 1 };
            const mockUser = { _id: 'userId', tokenVersion: 1 };
            jwt.verify.mockReturnValue(decoded);
            UserModel.findById.mockResolvedValue(mockUser);

            const result = await usersHandler.verifyToken(mockToken);

            expect(jwt.verify).toHaveBeenCalledWith(mockToken, expect.any(String));
            expect(UserModel.findById).toHaveBeenCalledWith(decoded.id);
            expect(result).toEqual(mockUser);
        });

        it('should throw an error if token verification fails', async () => {
            const mockToken = 'invalidToken';
            jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

            await expect(usersHandler.verifyToken(mockToken)).rejects.toThrow('Invalid token');
        });
    });

    describe('logoutUser', () => {
        it('should increment the token version for the user on logout', async () => {
            const mockUserId = 'userId';
            const updatedUser = { _id: mockUserId, tokenVersion: 2 };

            UserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

            const result = await usersHandler.logoutUser(mockUserId);

            expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(mockUserId, { $inc: { tokenVersion: 1 } });
            expect(result).toEqual(updatedUser);
        });
    });
});
