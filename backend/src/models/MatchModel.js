import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    roomId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
    winnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
}, {
    timestamps: { 
        createdAt: 'startTime', 
        updatedAt: 'endTime',
    },
});

export default mongoose.model('Match', matchSchema);