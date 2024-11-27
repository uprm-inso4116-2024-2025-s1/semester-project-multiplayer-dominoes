const Room = require('../models/RoomsModel');
const User = require('../models/UserModel');
const {
  RoomNameAvailableSpecification,
  RoomCapacitySpecification,
} = require('../specifications/RoomSpecification.js');




const getAllRooms = async (req, res) => {
 
  try {
    const rooms = await Room.find({});
    res.status(200).json(rooms);  
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};


const createRoom = async (req, res) => {
  const { name, creatorUuid } = req.body;

  if (!name || !creatorUuid) {
      return res.status(400).json({ error: 'Room name and creator UUID are required' });
  }

  try {
      const creator = await User.findOne({ uuid: creatorUuid });
      if (!creator) {
          return res.status(404).json({ error: 'Creator not found' });
      }

      const nameSpec = new RoomNameAvailableSpecification(Room);
      const isNameAvailable = await nameSpec.isSatisfiedBy(name);

      if (!isNameAvailable) {
          return res.status(400).json({ error: 'Room with that name already exists' });
      }

      const newRoom = new Room({ name, creator: creator._id });
      await newRoom.save();
      res.status(201).json(newRoom);
  } catch (err) {
      res.status(500).json({ error: 'Failed to create room' });
  }
};




const joinRoom = async (req, res) => {
  const { roomId } = req.params;
  const { userUuid } = req.body;

  try {
      const user = await User.findOne({ uuid: userUuid });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const room = await Room.findById(roomId);
      if (!room) {
          return res.status(404).json({ error: 'Room not found' });
      }

      const capacitySpec = new RoomCapacitySpecification();
      if (!capacitySpec.isSatisfiedBy(room)) {
          return res.status(400).json({ error: 'Room is full' });
      }

      room.players += 1;
      room.currentPlayers.push(user._id);
      await room.save();
      res.status(200).json(room);
  } catch (err) {
      res.status(500).json({ error: 'Failed to join room' });
  }
};

module.exports = { getAllRooms, createRoom, joinRoom };
