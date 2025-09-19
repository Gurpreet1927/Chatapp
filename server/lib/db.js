import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        mongoose.connection.on('connected', ()=> console.log('Database Connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error) {
        console.log("Database connection error:", error.message);
        process.exit(1); // Exit the process on DB connection failure
    }
};
