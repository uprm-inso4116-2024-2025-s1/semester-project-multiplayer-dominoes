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
            const savedData = await this.userHandler.createUser(req.body);
            res.status(201).json(savedData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userHandler.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isPasswordValid = await this.userHandler.validatePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = this.userHandler.generateToken(user);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}