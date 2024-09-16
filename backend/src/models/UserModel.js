import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    uuid: { 
        type: String, 
        required: true, 
        unique: true 
    },
});

export default mongoose.model('User', userSchema);