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


//Mahreen's Code for Admin
// Activate or Deactivate a user
adminRouter.patch(
  "/api/v1/admin/users/:userId/status",
  isAuth,
  adminController.updateUserStatus
);


// Add category
adminRouter.post("/api/v1/admin/categories", isAuth, adminController.addCategory);

// Update category
adminRouter.put("/api/v1/admin/categories/:categoryId", isAuth, adminController.updateCategory);

// Delete category
adminRouter.delete("/api/v1/admin/categories/:categoryId", isAuth, adminController.deleteCategory);

// Generate and export reports
adminRouter.get("/api/v1/admin/reports", isAuth, adminController.generateReports);

// Send system notifications
adminRouter.post("/api/v1/admin/notifications", isAuth, adminController.sendNotification);
