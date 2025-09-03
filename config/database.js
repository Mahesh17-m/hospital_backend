const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.__mongoose; 

const connectDB = async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in environment');
  }

  if (cached && mongoose.connection.readyState === 1) {
    return cached;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      minPoolSize: 1,
      maxPoolSize: 5
    });

    cached = conn;
    global.__mongoose = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectDB;
