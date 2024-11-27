export default class MatchRepository {
    #matchModel;
    
    constructor(matchModel) {
        this.#matchModel = matchModel;
    }

    async getAllMatches() {
        return await this.#matchModel.find();
    }

    async createMatch(data) {
        const match = new this.#matchModel({
            roomId: data.roomId,
            winnerId: data.winnerId,
            status: data.status,
        });
        return await match.save();
    }

    async findMatchById(roomId) {
        return await this.#matchModel.findOne({ roomId: roomId});
    }

    async findMatchByIdAndUpdate(roomId, data) {
        return await this.#matchModel.findOneAndUpdate({roomId: roomId}, data);
    }
};