export default class AchievementRepository {
    #achievementModel;

    constructor(achievementModel) {
        this.#achievementModel = achievementModel;
    }

    async getAllAchievements() {
        return await this.#achievementModel.find();
    }

    async createAchievement(data) {
        const achievement = new this.#achievementModel({
            username: data.username,
            status: data.status,
        });
        return await achievement.save();
    }

    async updateAchievement(username, data) {
        return await this.#achievementModel.findOneAndUpdate({ username: username }, data);
    }
}