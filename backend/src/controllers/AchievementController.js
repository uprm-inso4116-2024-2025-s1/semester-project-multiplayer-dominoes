export default class AchievementController {
    #achievementHandler;

    constructor(achievementHandler) {
        this.#achievementHandler = achievementHandler;
    }

    async getAllAchievements(req, res) {
        try{
            const achievements = await this.#achievementHandler.getAllAchivements();
            return res.status(200).json(achievements);
        }
        catch(error){
            return res.status(500).json({ error: error.message });
        }
    }

    async createAchievement(req, res) {
        try{
            const data = req.body;
            const achievement = await this.#achievementHandler.createAchivement(data);
            return res.status(201).json(achievement);
        }
        catch(error){
            return res.status(500).json({ error: error.message });
        }
    }

    async updateAchievement(req, res) {
        try{
            const id = req.params.id;
            const data = req.body;
            const achievement = await this.#achievementHandler.updateAchivement(id, data);
            return res.status(200).json(achievement);
        }
        catch(error){
            return res.status(500).json({ error: error.message });
        }
    }
};