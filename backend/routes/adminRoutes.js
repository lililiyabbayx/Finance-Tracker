const express = require("express");
const adminController = require("../controllers/adminController");
const isAuth = require("../middlewares/isAuth");

const adminRouter = express.Router();

// Admin view all users
adminRouter.get("/api/v1/admin/users", isAuth, adminController.viewUsers);

// Admin delete a user
adminRouter.delete(
  "/api/v1/admin/users/:userId",
  isAuth,
  adminController.deleteUser
);

module.exports = adminRouter;
