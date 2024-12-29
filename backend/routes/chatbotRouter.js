const express = require("express");
const { chatbotResponse } = require("../controllers/chatcontroller");
const isAuth = require("../middlewares/isAuth"); // Make sure the path is correct

const chatbotRouter = express.Router();

// Ensure isAuth middleware is applied here
chatbotRouter.post("/chatbot", isAuth, chatbotResponse);

module.exports = chatbotRouter;