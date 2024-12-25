const express = require("express");
const isAuth = require("../middlewares/isAuth");
const {
  addTransaction,
  getTransactions,
  getTransactionsByType,
  getTransactionsByDate,
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

// Update Transaction
transactionRouter.put("/:transactionId", isAuth, updateTransaction);

// Delete Transaction
transactionRouter.delete("/:transactionId", isAuth, deleteTransaction);

module.exports = transactionRouter;
