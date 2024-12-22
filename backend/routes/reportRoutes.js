const express = require("express");
const reportRouter = express.Router();
const { generateFinancialReport, getUserReports } = require("../controllers/reportController");
const isAuth = require("../middlewares/isAuth"); // Assuming there's an authentication middleware

// Route to generate a financial report for a user
reportRouter.post("/generate", isAuth, generateFinancialReport);

// Route to get all reports for a specific user
reportRouter.get("/:userId", isAuth, getUserReports);

module.exports = reportRouter;
