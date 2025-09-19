import express from "express";
import { createGroup, getMyGroups, updateGroupProfilePic, updateGroupDetails, leaveGroup, deleteGroup, addMember, removeMember } from "../controllers/groupController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

// Create a group
router.post("/create", protectRoute, createGroup);

// Get groups for logged-in user
router.get("/my-groups", protectRoute, getMyGroups);

// Update group profile picture
router.put("/update-profile-pic/:groupId", protectRoute, updateGroupProfilePic);

// Update group details (name and bio)
router.put("/update-details/:groupId", protectRoute, updateGroupDetails);

// Leave group
router.put("/leave/:groupId", protectRoute, leaveGroup);

// Delete group
router.delete("/delete/:groupId", protectRoute, deleteGroup);

// Add member to group
router.put("/add-member/:groupId", protectRoute, addMember);

// Remove member from group
router.put("/remove-member/:groupId", protectRoute, removeMember);

export default router;
