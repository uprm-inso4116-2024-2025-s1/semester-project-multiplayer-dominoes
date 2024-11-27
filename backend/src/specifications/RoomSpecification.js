// RoomSpecifications.js
class Specification {
    isSatisfiedBy(candidate) {
        throw new Error('Method not implemented.');
    }
}

class RoomNameAvailableSpecification extends Specification {
    constructor(roomModel) {
        super();
        this.roomModel = roomModel;
    }

    async isSatisfiedBy(name) {
        const existingRoom = await this.roomModel.findOne({ name });
        return !existingRoom;
    }
}

class RoomCapacitySpecification extends Specification {
    isSatisfiedBy(room) {
        return room.players < room.maxPlayers;
    }
}

export { RoomNameAvailableSpecification, RoomCapacitySpecification };
