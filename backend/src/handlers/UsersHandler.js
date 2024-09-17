import { v4 as uuidv4 } from 'uuid'; // Import the UUID package
import UserModel from "../models/UserModel.js";

export default class UsersHandler {
    async getAllUsers() {
        return await UserModel.find();
    }

    async createUser(data) {
        const user = new UserModel({
            name: data.name,
            age: parseInt(data.age),
            uuid: uuidv4() // Generate a unique UUID for the user
        });
        return await user.save();
    }
};