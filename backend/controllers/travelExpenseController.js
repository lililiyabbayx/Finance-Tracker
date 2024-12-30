const TravelExpense = require("../models/travelExpense");
const { validateTravelExpense } = require("../utils/validation");

// Create a new travel expense
exports.createTravelExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseData = { ...req.body, userId };

    // Validate expense data
    const validationError = validateTravelExpense(expenseData);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newExpense = new TravelExpense(expenseData);
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error creating travel expense:", error);
    res.status(500).json({ 
      message: "Failed to create travel expense", 
      error: error.message 
    });
  }
};

// Get all travel expenses for a user
exports.getTravelExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await TravelExpense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching travel expenses:", error);
    res.status(500).json({ 
      message: "Failed to fetch travel expenses", 
      error: error.message 
    });
  }
};

// Get a single travel expense
exports.getTravelExpense = async (req, res) => {
  try {
    const expense = await TravelExpense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a travel expense
exports.updateTravelExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Validate update data
    const validationError = validateTravelExpense(updateData);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedExpense = await TravelExpense.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Error updating travel expense:", error);
    res.status(500).json({ 
      message: "Failed to update travel expense", 
      error: error.message 
    });
  }
};

// Delete a travel expense
exports.deleteTravelExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedExpense = await TravelExpense.findOneAndDelete({ _id: id, userId });
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting travel expense:", error);
    res.status(500).json({ 
      message: "Failed to delete travel expense", 
      error: error.message 
    });
  }
};

// Get travel expenses by category
exports.getExpensesByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await TravelExpense.aggregate([
      { $match: { userId: userId } },
      { $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }},
      { $sort: { total: -1 } }
    ]);
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses by category:", error);
    res.status(500).json({ 
      message: "Failed to fetch expenses by category", 
      error: error.message 
    });
  }
};

// Get travel expenses by type (Personal/Business)
exports.getExpensesByType = async (req, res) => {
  try {
    const expenses = await TravelExpense.find({
      userId: req.user._id,
      type: req.params.type,
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get budget summary
exports.getBudgetSummary = async (req, res) => {
  try {
    const expenses = await TravelExpense.find({ userId: req.user._id });
    const summary = expenses.reduce((acc, expense) => {
      acc.totalSpent += expense.amount;
      acc.totalBudget += expense.budget;
      return acc;
    }, { totalSpent: 0, totalBudget: 0 });
    
    res.json({
      ...summary,
      remaining: summary.totalBudget - summary.totalSpent,
      percentageUsed: (summary.totalSpent / summary.totalBudget) * 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
