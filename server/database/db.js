// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.Mongourl;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); // No deprecated options
    console.log('✅ MongoDB Atlas connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }

  // Optional listeners
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
  });
};
