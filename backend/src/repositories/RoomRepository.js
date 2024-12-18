export default class RoomRepository {
    #roomModel;

    constructor(roomModel) {
        this.#roomModel = roomModel;
    }

    async getAllRooms() {
        return await this.#roomModel.find();
    }

    async findRoomByName(name) {
        return await this.#roomModel.findOne({ name });
    }

    async findRoomById(id) {
        return await this.#roomModel.findById(id);
    }

    async createRoom(data) {
        const room = new this.#roomModel({
            name: data.name,
            creator: data.creator,
        });
        return await room.save();
    }

    async updateRoom(room) {
        return await this.#roomModel.updateOne({ name: room.name }, room, {returnDocument: 'after'});
    }

    async deleteRoom(name) {
        return await this.#roomModel.deleteOne({ name });
    }
}