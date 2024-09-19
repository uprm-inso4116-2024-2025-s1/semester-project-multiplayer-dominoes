import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
});

export default mongoose.model('Achievement', achievementSchema);