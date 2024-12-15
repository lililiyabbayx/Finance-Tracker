const express = require("express");
const userController = require("../controllers/UserController");
const isAuth = require("../middlewares/isAuth");

const userRouter = express.Router();

// Register User
userRouter.post("/api/v1/users/register", userController.register);

// Login User
userRouter.post("/api/v1/users/login", userController.login);

// Get User Profile
userRouter.get("/api/v1/users/profile", isAuth, userController.profile);

module.exports = userRouter;
