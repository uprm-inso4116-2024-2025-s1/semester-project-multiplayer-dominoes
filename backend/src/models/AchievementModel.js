import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        default: 0,
    },
});

export default mongoose.model('Achievement', achievementSchema);