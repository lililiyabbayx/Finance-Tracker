const express = require("express");

const userController = require("../controllers/UserController");
const isAuthinticated = require("../middlewares/isAuth");
const userRouter = express.Router();
//register
userRouter.post("/api/v1/users/register", userController.register);
userRouter.post("/api/v1/users/login", userController.login);
userRouter.get(
  "/api/v1/users/profile",
  isAuthinticated,
  userController.profile
);
module.exports = userRouter;
