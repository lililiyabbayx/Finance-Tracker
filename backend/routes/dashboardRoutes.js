const express = require("express");
const router = express.Router();
const dashboardRouter = express.Router();
const { getDashboardSummary } = require("../controllers/dashboardController");

// Route to fetch the dashboard summary
router.get("/:userId", getDashboardSummary);

module.exports = dashboardRouter;
