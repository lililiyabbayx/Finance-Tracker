const mongoose = require("mongoose");
const Transaction = require("../model/transaction");
const Expense = require("../model/expense");
const Income = require("../model/income");

// Add a new transaction and corresponding expense/income record
exports.addTransaction = async (req, res) => {
  const { date, description, amount, category, type } = req.body;

  try {
    console.log("Adding transaction:", {
      userId: req.user,
      date,
      description,
      amount,
      category,
      type,
    });

    // Create the transaction record
    const newTransaction = new Transaction({
      userId: req.user,
      date,
      description,
      amount,
      category,
      type,
    });

    // Save the transaction
    await newTransaction.save();

    // Create corresponding income or expense entry based on the type
    if (type === "expense") {
      const newExpense = new Expense({
        userId: req.user,
        category,
        amount,
        date,
        description,
      });
      await newExpense.save();
      console.log("Expense saved:", newExpense);
    } else if (type === "income") {
      const newIncome = new Income({
        userId: req.user,
        category,
        amount,
        date,
        description,
      });
      await newIncome.save();
      console.log("Income saved:", newIncome);
    }

    res.status(201).json({
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error adding transaction:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all transactions for a user
exports.getTransactions = async (req, res) => {
  try {
    console.log("Fetching transactions for user:", req.user);
    const transactions = await Transaction.find({ userId: req.user });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get transactions by type (income or expense)
exports.getTransactionsByType = async (req, res) => {
  const { type } = req.params; // income or expense
  try {
    console.log(`Fetching ${type} transactions for user:`, req.user);
    const transactions = await Transaction.find({
      userId: req.user,
      type,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(`Error fetching ${type} transactions:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get transactions within a specific date range (daily, monthly, yearly)
exports.getTransactionsByDate = async (req, res) => {
  const { period } = req.params; // daily, monthly, or yearly
  const { startDate, endDate } = req.query; // Optional date range

  console.log(
    `Fetching transactions for period: ${period}, startDate: ${startDate}, endDate: ${endDate}`
  );

  let query = { userId: req.user };

  // Adjust query based on period
  if (period === "daily") {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (period === "monthly") {
    query.date = {
      $gte: new Date(`${startDate}-01`),
      $lt: new Date(`${parseInt(startDate.split("-")[0]) + 1}-01`),
    };
  } else if (period === "yearly") {
    query.date = {
      $gte: new Date(`${startDate}-01-01`),
      $lt: new Date(`${parseInt(startDate.split("-")[0]) + 1}-01-01`),
    };
  }

  try {
    const transactions = await Transaction.find(query);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions by date:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get revenue vs expense comparison by period
exports.getRevenueExpenseComparison = async (req, res) => {
  const { period } = req.params; // daily, monthly, or yearly
  console.log(`Fetching revenue vs expense comparison for period: ${period}`);

  try {
    const revenue = await Income.aggregate([
      { $match: { userId: req.user } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const expenses = await Expense.aggregate([
      { $match: { userId: req.user } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({ revenue, expenses });
  } catch (error) {
    console.error(
      "Error fetching revenue vs expense comparison:",
      error.message
    );
    res.status(500).json({ message: error.message });
  }
};

// Calculate Revenue and Profit
exports.calculateRevenueProfit = async (req, res) => {
  try {
    const revenue = await Income.aggregate([
      { $match: { userId: req.user } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);

    const expenses = await Expense.aggregate([
      { $match: { userId: req.user } },
      { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
    ]);

    const profit = revenue[0]?.totalRevenue - expenses[0]?.totalExpenses || 0;

    res.status(200).json({
      revenue: revenue[0]?.totalRevenue || 0,
      expenses: expenses[0]?.totalExpenses || 0,
      profit,
    });
  } catch (error) {
    console.error("Error calculating revenue and profit:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const { date, description, amount, category, type } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        date,
        description,
        amount,
        category,
        type,
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      transactionId
    );

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    res.status(500).json({ message: error.message });
  }
};

//Mahreen's Code for Admin 
// Activate/Deactivate user account
exports.updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body; // Expect 'active' or 'inactive'
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.status = status;
    await user.save();
    res.status(200).json({ message: "User status updated", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user status", error: err });
  }
};

// Delete user account
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
};

exports.sendNotification = async (req, res) => {
  const { title, message } = req.body;
  try {
    // Example: Sending email notifications (configure your email service)
    await EmailService.sendToAllUsers({ title, message });
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sending notification", error: err });
  }
};

