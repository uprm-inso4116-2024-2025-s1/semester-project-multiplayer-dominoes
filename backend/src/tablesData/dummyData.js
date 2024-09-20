// scripts/seedDummyData.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/UserModel.js';  // Adjust the path to your model

// Load environment variables (if using .env for MongoDB connection)
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Dummy data to insert
const users = [
    { username: 'John Doe', email: 'john@example.com', password: 'password123', uuid: 150, },
    { username: 'Mary Jane', email: 'mary@example.com', password: 'password987', uuid: 151 },
    { username: 'Alice Smith', email: 'alice@example.com', password: 'alicepass456', uuid: 152 },
    { username: 'Bob Brown', email: 'bob@example.com', password: 'bobsecure789', uuid: 153 },
    { username: 'Charlie Green', email: 'charlie@example.com', password: 'charlie1234', uuid: 154 },
    { username: 'Diana Prince', email: 'diana@example.com', password: 'diana2021', uuid: 155 },

];

// Insert dummy data
const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});

        // Insert users
        await User.insertMany(users);
        console.log('Inserted users:', users);


        mongoose.connection.close();  // Close the connection once done
    } catch (err) {
        console.error('Error inserting dummy data:', err);
    }
};

// Run the seed function
seedData();