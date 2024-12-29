// userRouter.js
const express = require("express");
const userController = require("../controllers/userController");
const isAuth = require("../middlewares/isAuth");

const userRouter = express.Router();

// Register User
userRouter.post("/api/v1/users/register", userController.register);

// Login User
// //business :{
//   "email": "test@example.com",
//   "password": "password123"
// }

userRouter.post("/api/v1/users/login", userController.login);

// Get User Profile

module.exports = userRouter;
