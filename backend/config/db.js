import mongoose from "mongoose";

let dbState = "disconnected";
let demoMode = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    demoMode = true;
    dbState = "demo";
    console.warn("MONGODB_URI is missing. Finora API is running with in-memory demo data.");
    return;
  }

  try {
    await mongoose.connect(uri);
    dbState = "connected";
    console.log("MongoDB connected");
  } catch (error) {
    dbState = "error";
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export const isDemoMode = () => demoMode;

export const getDbStatus = () => ({
  mode: demoMode ? "demo" : "mongodb",
  state: mongoose.connection.readyState === 1 ? "connected" : dbState
});

export default connectDB;
