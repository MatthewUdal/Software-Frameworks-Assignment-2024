const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

console.log('MONGO_URI:', process.env.MONGO_URI);


const connectDB = async () => {
  try {
    // Connect to MongoDB using the MONGO_URI from the .env file
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/softwareframeworks');
    console.log('MongoDB connected to:', mongoose.connection.name);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
