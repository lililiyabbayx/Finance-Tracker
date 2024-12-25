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

    // Save corresponding income or expense based on the type
    if (type === "expense") {
      const newExpense = new Expense({
        userId: req.user,
        category,
        amount,
        date,
        description,
        transactionId: newTransaction._id, // Add transactionId here
      });
      await newExpense.save({ session });
    } else if (type === "income") {
      const newIncome = new Income({
        userId: req.user,
        category,
        amount,
        date,
        description,
        transactionId: newTransaction._id, // Add transactionId here
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
    }).sort({ date: -1 });
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
      date: -1,
    });
    res.status(200).json(transactions);
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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update the transaction itself
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { date, description, amount, category, type },
      { new: true, session }
    );

    if (!updatedTransaction) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update the corresponding income or expense based on the type
    if (updatedTransaction.type === "expense") {
      const updatedExpense = await Expense.findOneAndUpdate(
        { transactionId },
        { date, description, amount, category },
        { new: true, session }
      );

      if (!updatedExpense) {
        throw new Error("Failed to update the corresponding expense");
      }
    } else if (updatedTransaction.type === "income") {
      const updatedIncome = await Income.findOneAndUpdate(
        { transactionId },
        { date, description, amount, category },
        { new: true, session }
      );

      if (!updatedIncome) {
        throw new Error("Failed to update the corresponding income");
      }
    }

    // Commit the transaction to persist all changes
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Transaction and corresponding record updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;

  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the transaction to determine its type and ensure it exists
    const transaction = await Transaction.findById(transactionId).session(
      session
    );
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Delete the transaction
    await Transaction.findByIdAndDelete(transactionId).session(session);

    // Delete the corresponding income or expense from the respective collection
    if (transaction.type === "expense") {
      const deletedExpense = await Expense.findOneAndDelete({
        userId: req.user,
        transactionId: transactionId,
      }).session(session);

      if (!deletedExpense) {
        throw new Error("Failed to delete the corresponding expense");
      }
    } else if (transaction.type === "income") {
      const deletedIncome = await Income.findOneAndDelete({
        userId: req.user,
        transactionId: transactionId,
      }).session(session);

      if (!deletedIncome) {
        throw new Error("Failed to delete the corresponding income");
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Transaction and corresponding record deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};
