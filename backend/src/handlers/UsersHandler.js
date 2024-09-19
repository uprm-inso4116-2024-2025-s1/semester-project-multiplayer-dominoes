import { v4 as uuidv4 } from 'uuid'; // Import the UUID package
import UserModel from "../models/UserModel.js";

export default class UsersHandler {
    async getAllUsers() {
        return await UserModel.find();
    }

    async createUser(data) {
        const user = new UserModel({
            username: data.username,
            email: data.email,
            password: data.password,
            uuid: uuidv4() // Generate a unique UUID for the user
        });
        return await user.save();
    }
};