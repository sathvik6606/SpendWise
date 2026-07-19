import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI environment variable is not set.");
        }
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("DB CONNECTION FAILED:", error.message);
        process.exit(1);
    }
};