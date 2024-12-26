const express = require("express");
const { chatbotResponse } = require("../controllers/chatcontroller");
const isAuth = require("../middlewares/isAuth"); // Make sure the path is correct

const router = express.Router();

// Ensure isAuth middleware is applied here
router.post("/chatbot", isAuth, chatbotResponse);

module.exports = router;
