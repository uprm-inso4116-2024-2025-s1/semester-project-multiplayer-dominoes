import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: 0
    },
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    tokenVersion: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    achivementsEarned: {
        type: Number,
        default: 0,
    },
}, {
    // Automatically adds createdAt and updatedAt fields
    // Handled by mongoose "under the hood"
    timestamps: true,
});

export default mongoose.model('User', userSchema);
