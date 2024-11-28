export default class AchievementHandler {
    #achievementRepository;

    constructor(achievementRepository) {
        this.#achievementRepository = achievementRepository;
    }

    async getAllAchivements() {
        return await this.#achievementRepository.getAllAchievements();
    }

    async createAchivement(data) {
        if (!data.name) {
            throw new Error('Name is required');
        }
        const achievement = await this.#achievementRepository.findAchievementByName(data.name);
        if (achievement !== null) {
            throw new Error('Achievement already exists');
        }
        return await this.#achievementRepository.createAchievement(data);
    }

    async updateAchivement(id, data) {
        if (!id) {
            throw new Error('Id is required');
        }
        const achievement = await this.#achievementRepository.updateAchievement(id, data);
        return achievement;
    }
}