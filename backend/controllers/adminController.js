const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const adminController = {
  // Admin view all users
  viewUsers: asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
  }),

  // Admin delete a user
  deleteUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ message: "User deleted successfully" });
  }),
};

module.exports = adminController;
