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
            name: data.name,
            description: data.description,
            points: data.points,
        });
        return await achievement.save();
    }

    async updateAchievement(name, data) {
        return await this.#achievementModel.findOneAndUpdate({ name: name }, data);
    }
}