export default class AchievementRepository {
    #achievementModel;

    constructor(achievementModel) {
        this.#achievementModel = achievementModel;
    }

    async getAllAchievements() {
        return await this.#achievementModel.find();
    }

    async findAchievementByName(name) {
        return await this.#achievementModel.findOne({ name });
    }

    async createAchievement(data) {
        const achievement = new this.#achievementModel({
            name: data.name,
            description: data.description,
            points: data.points,
        });
        return await achievement.save();
    }

    async updateAchievement(id, data) {
        return await this.#achievementModel.findByIdAndUpdate(id, data, {returnDocument: 'after'});
    }
}