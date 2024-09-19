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
    { name: 'John Doe', uuid: 150, email: 'john@example.com', password: 'password123' },
    { name: 'Mary Jane', uuid: 151, email: 'mary@example.com', password: 'password987' },
    { name: 'Alice Smith', uuid: 152, email: 'alice@example.com', password: 'alicepass456' },
    { name: 'Bob Brown', uuid: 153, email: 'bob@example.com', password: 'bobsecure789' },
    { name: 'Charlie Green', uuid: 154, email: 'charlie@example.com', password: 'charlie1234' },
    { name: 'Diana Prince', uuid: 155, email: 'diana@example.com', password: 'diana2021' },

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