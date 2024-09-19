import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    players: {      // { Player1: 'John', Player2: 'Sam', ... }
        type: Map,
        of: String,
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
});

export default mongoose.model('Match', matchSchema);