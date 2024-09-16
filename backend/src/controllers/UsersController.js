export default class UsersController {
    constructor(userHandler) {
        this.userHandler = userHandler;
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.userHandler.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createUser(req, res) {
        try {
            const savedData = this.userHandler.createUser(req.body);
            res.status(201).json(savedData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}