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

    async createRoom(data) {
        const roomObject = {
            name: data.name,
            creator: data.creator,
        };
        return await this.#roomModel.create(roomObject);
    }

    async updateRoom(room) {
        return await this.#roomModel.updateOne({ name: room.name }, room);
    }

    async deleteRoom(name) {
        return await this.#roomModel.deleteOne({ name });
    }
}