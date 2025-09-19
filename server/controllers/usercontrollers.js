import { generateToken } from "../lib/utilis.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudnary.js";

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account Created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = generateToken(userData._id);

    res.json({
      success: true,
      userData,
      token,
      message: "Login successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const getBlockedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('blockedUsers', 'fullName email');
    res.json({ success: true, blockedUsers: user.blockedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, bio } = req.body;
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;

    if (profilePic) {
      // upload to cloudinary
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "chat-app/users",
      });
      updateData.profilePic = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
};

export const blockUser = async (req, res) => {
  const { id: userIdToBlock } = req.params;
  try {
    const user = await User.findById(req.user._id);
    if (!user.blockedUsers.includes(userIdToBlock)) {
      user.blockedUsers.push(userIdToBlock);
      await user.save();
    }
    res.json({ success: true, message: "User blocked successfully" });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ success: false, message: "Failed to block user" });
  }
};

export const unblockUser = async (req, res) => {
  const { id: userIdToUnblock } = req.params;
  try {
    const user = await User.findById(req.user._id);
    user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== userIdToUnblock);
    await user.save();
    res.json({ success: true, message: "User unblocked successfully" });
  } catch (error) {
    console.error("Unblock user error:", error);
    res.status(500).json({ success: false, message: "Failed to unblock user" });
  }
};
