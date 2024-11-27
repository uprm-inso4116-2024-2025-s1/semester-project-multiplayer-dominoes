export default class MatchController {
    #matchHandler;

    constructor(matchHandler) {
        this.#matchHandler = matchHandler;
    }

    async getAllMatches(req, res) {
        try {
            const matches = await this.#matchHandler.getAllMatches();
            return res.status(200).json(matches);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async createMatch(req, res) {
        try {
            const data = req.body;
            const match = await this.#matchHandler.createMatch(data);
            return res.status(201).json(match);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateMatch(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const match = await this.#matchHandler.updateMatch(id, data);
            return res.status(200).json(match);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
