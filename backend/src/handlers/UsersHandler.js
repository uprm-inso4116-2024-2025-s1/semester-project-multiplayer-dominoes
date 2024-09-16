import UserModel from "../models/UserModel.js";

export default class UsersHandler {
    async getAllUsers() {
        return await UserModel.find();
    }

    async createUser(data) {
        const user = new UserModel({
            name: data.name,
            age: parseInt(data.age),
        });
        return await user.save();
    }
};