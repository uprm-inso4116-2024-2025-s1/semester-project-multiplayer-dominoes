import mongoose from "mongoose";

const userAchievementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    achievementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement',
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
    earnedAt: {
        type: Date,
    },
});

export default mongoose.model('UserAchievement', userAchievementSchema);