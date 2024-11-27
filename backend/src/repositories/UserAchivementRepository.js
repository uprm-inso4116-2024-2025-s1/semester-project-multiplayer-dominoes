export default class UserAchievementRepository {
    #userAchievementModel;

    constructor(userAchievementModel) {
        this.#userAchievementModel = userAchievementModel;
    }

    async getAllUserAchievements(userId) {
        return await this.#userAchievementModel.find({ userId: userId });
    }

    async createUserAchievement(data) {
        const achievement = new this.#userAchievementModel({
            userId: data.userId,
            achievementId: data.achievementId,
            status: data.status,
            earnedAt: Date.now(),
        });
        return await achievement.save();
    }

    async updateUserAchievement(userId, achievementId, data) {
        return await this.#userAchievementModel.findOneAndUpdate({ userId: userId, achievementId: achievementId }, data, {returnDocument: 'after'});
    }
}