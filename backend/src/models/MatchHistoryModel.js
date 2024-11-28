import mongoose from "mongoose";

const matchHistorySchema = new mongoose.Schema({
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    score: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: { 
        createdAt: 'startTime', 
        updatedAt: 'endTime',
    },
});

export default mongoose.model('MatchHistory', matchHistorySchema);