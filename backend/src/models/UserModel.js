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
    profilePicture: {
        type: String,
        default: '/default-profile.png', 
    },
});

export default mongoose.model('User', userSchema);
