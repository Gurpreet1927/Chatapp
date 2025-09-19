import Group from "../models/group.js";
import cloudinary from "../lib/cloudnary.js"; // Correct to actual filename

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, members, profilePic } = req.body;
    const creator = req.user._id;

    if (!name || !members || members.length === 0) {
      return res.status(400).json({ success: false, message: "Group name and members are required" });
    }

    const newGroup = new Group({
      name,
      members: [creator, ...members],
      createdBy: creator,
      profilePic: profilePic || '',
    });

    await newGroup.save();
    res.status(201).json({ success: true, group: newGroup });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get groups for logged-in user
export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId }).populate('members', 'fullName profilePic').populate('createdBy', 'fullName _id');
    res.json({ success: true, groups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update group profile picture
export const updateGroupProfilePic = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ success: false, message: "Profile picture is required" });
    }

    // Upload new profile picture to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "group_profile_pics",
      overwrite: true,
      resource_type: "image",
    });

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    res.json({ success: true, group: updatedGroup });
  } catch (error) {
    console.error("Error updating group profile picture:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update group details (name and bio)
export const updateGroupDetails = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { name, bio } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Group name is required" });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { name: name.trim(), bio: bio ? bio.trim() : "" },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    res.json({ success: true, group: updatedGroup });
  } catch (error) {
    console.error("Error updating group details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Leave group
export const leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (!group.members.includes(userId)) {
      return res.status(400).json({ success: false, message: "User is not a member of the group" });
    }

    if (group.members.length === 1) {
      // If only one member, delete the group
      await Group.findByIdAndDelete(groupId);
      res.json({ success: true, message: "Group deleted as it had only one member" });
    } else {
      // Remove user from members
      group.members = group.members.filter(member => member.toString() !== userId.toString());
      await group.save();
      res.json({ success: true, message: "Left the group successfully" });
    }
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete group (only creator can delete)
export const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (!group.createdBy.equals(userId)) {
      return res.status(403).json({ success: false, message: "Only the group creator can delete the group" });
    }

    await Group.findByIdAndDelete(groupId);
    res.json({ success: true, message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add member to group
export const addMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { memberId } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (!group.members.includes(userId)) {
      return res.status(403).json({ success: false, message: "You are not a member of this group" });
    }

    if (group.members.includes(memberId)) {
      return res.status(400).json({ success: false, message: "User is already a member" });
    }

    group.members.push(memberId);
    await group.save();

    // Populate the updated group to include member details
    const updatedGroup = await Group.findById(groupId).populate('members', 'fullName profilePic').populate('createdBy', 'fullName _id');

    res.json({ success: true, message: "Member added successfully", group: updatedGroup });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove member from group
export const removeMember = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { memberId } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (!group.createdBy.equals(userId)) {
      return res.status(403).json({ success: false, message: "Only the group creator can remove members" });
    }

    if (!group.members.includes(memberId)) {
      return res.status(400).json({ success: false, message: "User is not a member" });
    }

    if (memberId === userId) {
      return res.status(400).json({ success: false, message: "Cannot remove yourself" });
    }

    group.members.pull(memberId);
    await group.save();

    // Populate the updated group to include member details
    const updatedGroup = await Group.findById(groupId).populate('members', 'fullName profilePic').populate('createdBy', 'fullName _id');

    res.json({ success: true, message: "Member removed successfully", group: updatedGroup });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
