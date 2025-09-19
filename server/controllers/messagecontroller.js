import Message from "../models/message.js";
import User from "../models/user.js";
import Group from "../models/group.js";
import cloudinary from "../lib/cloudnary.js";
import { io, userSocketMap } from "../server.js";

// Get users for sidebar along with unseen messages count
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};
    await Promise.all(
      users.map(async (user) => {
        const messages = await Message.find({
          senderId: user._id,
          receiverId: userId,
          seen: false,
        });
        if (messages.length > 0) {
          unseenMessages[user._id] = messages.length;
        }
      })
    );

    res.json({ success: true, users, unseenMessages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages between current user and selected user or group
export const getMessages = async (req, res) => {
  try {
    const selectedId = req.params.id;
    const myId = req.user._id;

    // Check if selectedId is a group
    const group = await Group.findById(selectedId);
    let messages;

    if (group) {
      // Fetch group messages
      messages = await Message.find({ groupId: selectedId }).sort({ createdAt: 1 }).populate('senderId', 'fullName profilePic');
    } else {
      // Fetch user-to-user messages
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: selectedId },
          { senderId: selectedId, receiverId: myId },
        ],
      }).sort({ createdAt: 1 });

      // Mark all messages from selected user as seen
      await Message.updateMany(
        { senderId: selectedId, receiverId: myId },
        { seen: true }
      );
    }

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark a single message as seen
export const markMessagesAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, groupId } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let newMessage;
    if (groupId) {
      // Sending message to group
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ success: false, message: "Group not found" });
      }
      if (!group.members.includes(senderId)) {
        return res.status(403).json({ success: false, message: "You are not a member of this group" });
      }
      newMessage = await Message.create({
        senderId,
        groupId,
        text,
        image: imageUrl,
      });
      // Emit to all group members except sender
      group.members.forEach(memberId => {
        if (memberId.toString() !== senderId.toString()) {
          const socketId = userSocketMap[memberId.toString()];
          if (socketId) {
            io.to(socketId).emit("newMessage", newMessage);
          }
        }
      });
    } else {
      // Sending message to individual user
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      if (receiver.blockedUsers.includes(senderId)) {
        return res.status(403).json({ success: false, message: "You are blocked by this user." });
      }
      newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete all messages between current user and selected user
export const deleteChatWithUser = async (req, res) => {
  try {
    const selectedUserId = req.params.id;
    const myId = req.user._id;

    // Delete all messages where sender and receiver are either user
    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
