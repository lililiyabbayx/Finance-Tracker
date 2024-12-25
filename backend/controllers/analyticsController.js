const mongoose = require("mongoose");
const Transaction = require("../model/transaction"); // Assuming the model is 'Transaction'

// Calculate Revenue, Expenses, and Profit
exports.calculateRevenueProfit = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    // Aggregating income (Total Income / Revenue)
    const incomeData = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user),
          type: "income",
        },
      },
      {
        $group: { _id: null, totalIncome: { $sum: "$amount" } },
      },
    ]);

    // Aggregating expenses
    const expenseData = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user),
          type: "expense",
        },
      },
      {
        $group: { _id: null, totalExpense: { $sum: "$amount" } },
      },
    ]);

    // Extract total income and expense
    const totalIncome = incomeData[0]?.totalIncome || 0;
    const totalExpense = expenseData[0]?.totalExpense || 0;

    // Calculate profit
    const profit = totalIncome - totalExpense;

    // Return revenue, expenses, and profit
    res.status(200).json({
      totalIncome,
      totalExpense,
      profit,
      totalRevenue: totalIncome, // Revenue is essentially the total income
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get revenue vs expense comparison by period (with categories)
exports.getRevenueExpenseComparison = async (req, res) => {
    const { period } = req.params;
  
    if (!req.user) {
      return res.status(400).json({ message: "User not authenticated" });
    }
  
    let dateFilter = {};
    const now = new Date();
  
    // Date filter based on the period (daily, monthly, yearly)
    if (period === "daily") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      dateFilter = { $gte: startOfDay };
    } else if (period === "monthly") {
      dateFilter = {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      };
    } else if (period === "yearly") {
      dateFilter = {
        $gte: new Date(now.getFullYear(), 0, 1),
        $lt: new Date(now.getFullYear() + 1, 0, 1),
      };
    }
  
    try {
      // Aggregating revenue (income) by category and period
      const revenue = await Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.user),
            type: "income",
            date: dateFilter,
          },
        },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
      ]);
  
      // Aggregating expenses by category and period
      const expenses = await Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.user),
            type: "expense",
            date: dateFilter,
          },
        },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
      ]);
  
      // Combine revenue and expenses into a single object
      const combinedData = revenue.map((revenueItem) => {
        const expenseItem = expenses.find(
          (expense) => expense._id === revenueItem._id
        );
        return {
          category: revenueItem._id,
          revenue: revenueItem.total,
          expense: expenseItem ? expenseItem.total : 0,
        };
      });
  
      res.status(200).json({
        revenue: revenue,
        expenses: expenses,
        combinedData: combinedData,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
