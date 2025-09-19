import express from "express";
import { getUsersForSidebar, getMessages, markMessagesAsSeen, sendMessage, deleteChatWithUser } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

// Get users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get messages between current user and selected user
router.get("/:id", protectRoute, getMessages);

// Mark a message as seen
router.put("/mark/:id", protectRoute, markMessagesAsSeen);

// Send a message to a selected user
router.post("/send/:id", protectRoute, sendMessage);

// Delete chat with a user
router.delete("/delete-chat/:id", protectRoute, deleteChatWithUser);

export default router;
