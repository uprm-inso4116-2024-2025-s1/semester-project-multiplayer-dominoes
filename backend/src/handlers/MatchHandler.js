export default class MatchHandler {
    #matchRepository;
    #roomRepository;

    constructor(matchRepository, roomRepository) {
        this.#matchRepository = matchRepository;
        this.#roomRepository = roomRepository;
    }

    async getAllMatches() {
        return await this.#matchRepository.getAllMatches();
    }

    async createMatch(data) {
        if (!data.roomId) {
            throw new Error('Room ID is required');
        }
        const room = await this.#roomRepository.findRoomById(data.roomId);
        if (room === null) {
            throw new Error('Room not found');
        }
        return await this.#matchRepository.createMatch(data);
    }

    async updateMatch(id, data) {
        if (!id) {
            throw new Error('Match ID is required');
        }
        const match = await this.#matchRepository.findMatchById(id)
        if (match === null) {
            throw new Error('Match not found');
        }
        return await this.#matchRepository.findMatchByIdAndUpdate(id, data);
    }
};
