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
            players: data.players,
            status: data.status
        });
        return await match.save();
    }

    async findMatchById(id) {
        return await this.#matchModel.findById(id);
    }

    async findMatchByIdAndUpdate(id, data) {
        return await this.#matchModel.findByIdAndUpdate(id, data);
    }
};