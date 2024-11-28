export default class MatchHistoryRepository {
    #matchHistoryModel;
    
    constructor(matchHistoryModel) {
        this.#matchHistoryModel = matchHistoryModel;
    }

    async getFullMatchHistory(userId) {
        return await this.#matchHistoryModel.find({ userId: userId });
    }

    async createMatchHistory(data) {
        const match = new this.#matchHistoryModel({
            matchId: data.matchId,
            userId: data.userId,
            score: data.score,
        });
        return await match.save();
    }

    async findMatchHistoryById(userId, matchId) {
        return await this.#matchHistoryModel.findOne({userId: userId, matchId: matchId});
    }

    async findMatchHistoryByIdAndUpdate(userId, matchId, data) {
        return await this.#matchHistoryModel.findOneAndUpdate({userId: userId, matchId: matchId}, data, {returnDocument: 'after'});
    }
};