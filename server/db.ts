// Integration: javascript_database
import mongoose from 'mongoose';
import * as schema from "@shared/schema";

if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
  throw new Error(
    "MONGODB_URI or DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

// MongoDB connection
export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    
    await mongoose.connect(MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Auto-connect on import
connectDB().catch(console.error);

export { mongoose };
export const db = mongoose;