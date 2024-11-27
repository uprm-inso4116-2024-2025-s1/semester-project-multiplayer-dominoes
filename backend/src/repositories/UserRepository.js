export default class UserRepository {
    #userModel;
    
    constructor(userModel) {
        this.#userModel = userModel;
    }

    async getAllUsers() {
        return await this.#userModel.find();
    }

    async createUser(data) {
        const user = new this.#userModel({
            username: data.username,
            email: data.email,
            password: data.password,
            uuid: data.uuid
        });
        return await user.save();
    }

    async findUserByEmail(email) {
        return await this.#userModel.findOne({ email });
    }

    async findUserByUsername(username) {
        return await this.#userModel.findOne({ username });
    }

    async findUserById(id) {
        return await this.#userModel.findById(id);
    }

    async findUserByIdAndUpdate(id, data) {
        return await this.#userModel.findByIdAndUpdate(id, data, {returnDocument: 'after'});
    }

    async updateUserProfilePicture(username, { profilePicture }) {
    return await this.#userModel.findOneAndUpdate(
        { username },
        { profilePicture },
        { new: true } // Ensures the updated user document is returned
    );
}

    
};