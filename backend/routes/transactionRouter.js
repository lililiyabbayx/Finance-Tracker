const express = require("express");
const isAuth = require("../middlewares/isAuth");
const {
  addTransaction,
  getTransactions,
  getTransactionsByType,
  getTransactionsByDate,
  calculateRevenueProfit,
  getRevenueExpenseComparison,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/RevenueandExpenseController");

const transactionRouter = express.Router();

// Add Transaction
transactionRouter.post("/", isAuth, addTransaction);

// Get All Transactions
transactionRouter.get("/", isAuth, getTransactions);

// Get Transactions by Type (expense or income)
transactionRouter.get("/type/:type", isAuth, getTransactionsByType);

// Get Transactions by Date (daily, monthly, yearly)
transactionRouter.get("/date/:period", isAuth, getTransactionsByDate);

// Calculate Revenue and Profit
transactionRouter.get("/revenue-profit", isAuth, calculateRevenueProfit);

// Compare Revenue vs Expense for a period
transactionRouter.get(
  "/revenue-expense-comparison/:period",
  isAuth,
  getRevenueExpenseComparison
);

// Update Transaction
transactionRouter.put("/:transactionId", isAuth, updateTransaction);

// Delete Transaction
transactionRouter.delete("/:transactionId", isAuth, deleteTransaction);

module.exports = transactionRouter;
