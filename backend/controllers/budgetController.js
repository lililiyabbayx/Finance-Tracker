const Budget = require("../model/Budget");
const ExpenseSummary = require("../model/expSum");
const { sendEmailAlert } = require("./emailAlertController");
const mongoose = require('mongoose');

// Get current month's budget
const getCurrentBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentMonth = new Date().getMonth() + 1;
    
    const budget = await Budget.findOne({ 
      userId: new mongoose.Types.ObjectId(userId), 
      month: currentMonth 
    });
    
    if (!budget) {
      return res.status(404).json({ message: "No budget set for current month" });
    }
    
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Set the user's budget
const setBudget = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const userId = req.user._id;
    const month = new Date().getMonth() + 1; // Get current month

    const existingBudget = await Budget.findOne({ 
      userId: new mongoose.Types.ObjectId(userId), 
      month 
    });
    
    if (existingBudget) {
      existingBudget.totalAmount = totalAmount;
      await existingBudget.save();
      res.status(200).json(existingBudget);
    } else {
      const newBudget = new Budget({ 
        userId: new mongoose.Types.ObjectId(userId), 
        totalAmount, 
        month 
      });
      await newBudget.save();
      res.status(201).json(newBudget);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if the user is within their budget
const checkBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentMonth = new Date().getMonth() + 1;
    const budget = await Budget.findOne({ 
      userId: new mongoose.Types.ObjectId(userId), 
      month: currentMonth 
    });

    if (!budget) {
      return res.status(404).json({ message: "No budget set for current month" });
    }

    const expenseSummary = await ExpenseSummary.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId), 
          month: currentMonth 
        } 
      },
      { 
        $group: { 
          _id: "$userId", 
          total: { $sum: "$totalExpense" } 
        } 
      }
    ]);

    const totalExpense = expenseSummary.length > 0 ? expenseSummary[0].total : 0;

    if (totalExpense > budget.totalAmount) {
      await sendEmailAlert({ 
        email: req.user.email,
        subject: "Budget Exceeded", 
        message: `Your expenses (${totalExpense}) for the month have exceeded your set budget of ${budget.totalAmount}.`
      });
    }

    res.status(200).json({ 
      budget: budget.totalAmount,
      spent: totalExpense,
      remaining: budget.totalAmount - totalExpense
    });
  } catch (error) {
    console.error('Budget check error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { setBudget, checkBudget, getCurrentBudget };
