import mongoose from 'mongoose';
import config from './index.js';

let connected = false;

const connectDB = async () => {
  const uri = config.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not provided; running without persistent history.');
    return;
  }

  try {
    await mongoose.connect(uri, { autoIndex: true });
    connected = true;
    console.log('MongoDB connected');
  } catch (error) {
    connected = false;
    console.warn(
      'MongoDB connection failed, history will be in-memory only.',
      error.message,
    );
  }
};

export const isDbConnected = () =>
  connected && mongoose.connection.readyState === 1;

export default connectDB;
