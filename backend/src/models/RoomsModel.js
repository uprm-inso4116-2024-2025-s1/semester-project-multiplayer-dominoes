const mongoose = require('mongoose');


const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  players: {
    type: Number,
    default: 1,
  },
  maxPlayers: {
    type: Number,
    default: 4,
  },
  status: {
    type: String,
    enum: ['open', 'full'],
    default: 'open',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true,
  },
  currentPlayers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
    }
  ]
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
