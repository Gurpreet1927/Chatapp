import User from "../models/user.js";

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Optionally, you can also delete related data such as messages, groups, etc.

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};
