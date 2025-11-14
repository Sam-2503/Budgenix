import mongoose from "mongoose";
import "dotenv/config";

// MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI!;

// Connect to MongoDB
export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);    

  }
};