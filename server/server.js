import express from "express";
import "dotenv/config"
import cors from "cors";
import http from "http";
import path from "path";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";
import mongoose from "mongoose";
import groupRouter from "./routes/groupRoutes.js";

const app = express();
const server = http.createServer(app);

// socket.io
export const io = new Server(server,{
    cors: { origin: "*"},
});
// store online users

export const userSocketMap = {};

//socket.io connectiomn handler
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected" , userId);

    if(userId){
        userSocketMap[userId] = socket.id;
    }

    // emit online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    });
});

app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use('/chat', express.static(path.join(process.cwd(), 'docs')));

app.use("/api/status" , (req,res)=>res.send("server is live"));
app.use("/api/auth",userRouter);

app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);
 
// Connect to MongoDB

await connectDB();
console.log("MongoDB Connection State:", mongoose.connection.readyState);


const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log("Server is running on PORT: "+PORT));

export default server;

