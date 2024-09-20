import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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
});

export default mongoose.model('User', userSchema);
