import express from "express";
import { checkAuth, login, signup, updateProfile, blockUser, unblockUser, getBlockedUsers } from "../controllers/usercontrollers.js";
import { deleteUser } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.get("/blocked-users", protectRoute, getBlockedUsers);
userRouter.put("/block-user/:id", protectRoute, blockUser);
userRouter.put("/unblock-user/:id", protectRoute, unblockUser);
userRouter.delete("/delete/:id", protectRoute, deleteUser);

export default userRouter;
