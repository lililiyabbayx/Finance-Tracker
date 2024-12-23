const mongoose = require("mongoose");
const Transaction = require("../model/transaction");
const Expense = require("../model/expense");
const Income = require("../model/income");

// Add transaction
exports.addTransaction = async (req, res) => {
  const { date, description, amount, category, type } = req.body;

  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newTransaction = new Transaction({
      userId: req.user,
      date,
      description,
      amount,
      category,
      type,
    });

    await newTransaction.save({ session });

    if (type === "expense") {
      const newExpense = new Expense({
        userId: req.user,
        category,
        amount,
        date,
        description,
      });
      await newExpense.save({ session });
    } else if (type === "income") {
      const newIncome = new Income({
        userId: req.user,
        category,
        amount,
        date,
        description,
      });
      await newIncome.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// Get all transactions for a user
exports.getTransactions = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const transactions = await Transaction.find({ userId: req.user }).sort({
      date: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transactions by type (income or expense)
exports.getTransactionsByType = async (req, res) => {
  const { type } = req.params;

  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const transactions = await Transaction.find({
      userId: req.user,
      type,
    }).sort({ date: -1 }); // Add sorting to keep transactions ordered by date
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transactions within a specific date range (daily, monthly, yearly)
exports.getTransactionsByDate = async (req, res) => {
  const { period } = req.params;
  const { startDate, endDate } = req.query;

  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  let query = { userId: req.user };

  try {
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

    const transactions = await Transaction.find(query).sort({
      date: -1, // Ensure the transactions are sorted by date
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate Revenue and Profit
exports.calculateRevenueProfit = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    // Aggregating revenue (income)
    const revenue = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user) } },
      {
        $group: { _id: null, totalRevenue: { $sum: { $toDouble: "$amount" } } },
      },
    ]);

    console.log("Revenue:", revenue); // Log the result

    // Aggregating expenses
    const expenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user) } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    console.log("Expenses:", expenses); // Log the result

    const totalRevenue = revenue[0]?.totalRevenue || 0;
    const totalExpenses = expenses[0]?.totalExpenses || 0;

    const profit = totalRevenue - totalExpenses;

    res.status(200).json({
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get revenue vs expense comparison by period
exports.getRevenueExpenseComparison = async (req, res) => {
  const { period } = req.params;

  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  let dateFilter = {};
  const now = new Date();

  // Reset the time for the date filter to make sure time doesn't interfere
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0); // Ensure time is set to 00:00:00

  if (period === "daily") {
    // Filter for today
    dateFilter = { $gte: startOfDay };
  } else if (period === "monthly") {
    // Filter for the current month
    dateFilter = {
      $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    };
  } else if (period === "yearly") {
    // Filter for the current year
    dateFilter = {
      $gte: new Date(now.getFullYear(), 0, 1),
      $lt: new Date(now.getFullYear() + 1, 0, 1),
    };
  }

  console.log("Date Filter:", dateFilter); // Debug the date filter

  try {
    // Aggregating revenue (income)
    const revenue = await Income.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user),
          date: dateFilter,
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    // Aggregating expenses
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user),
          date: dateFilter,
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    console.log("Revenue:", revenue); // Debugging
    console.log("Expenses:", expenses); // Debugging

    res.status(200).json({ revenue, expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const { date, description, amount, category, type } = req.body;

  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { date, description, amount, category, type },
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
    res.status(500).json({ message: error.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;

  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      transactionId
    );

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
