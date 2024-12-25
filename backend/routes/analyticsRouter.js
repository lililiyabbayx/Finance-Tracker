const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const isAuth = require("../middlewares/isAuth");

// Route for calculating revenue, expenses, and profit
router.get(
  "/revenue-profit",
  isAuth,
  analyticsController.calculateRevenueProfit
);

// Route for getting revenue vs expense comparison by period
router.get(
  "/revenue-expense/:period",
  isAuth,
  analyticsController.getRevenueExpenseComparison
);

module.exports = router;
