const TravelExpense = require("../models/travelExpenses");
const { validateTravelExpense } = require("../utils/validation");

exports.getTravelExpenses = async (req, res) => {
  try {
    const userId = req.user;
    const expenses = await TravelExpense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Failed to fetch travel expenses", error: error.message });
  }
};

exports.createTravelExpense = async (req, res) => {
  try {
    const userId = req.user;
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
    console.error("Create expense error:", error);
    res.status(500).json({ 
      message: "Failed to create travel expense", 
      error: error.message 
    });
  }
};

exports.updateTravelExpense = async (req, res) => {
  try {
    const userId = req.user;
    const updatedExpense = await TravelExpense.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Failed to update travel expense", error: error.message });
  }
};

exports.deleteTravelExpense = async (req, res) => {
  try {
    const userId = req.user;
    const deletedExpense = await TravelExpense.findOneAndDelete({ 
      _id: req.params.id, 
      userId 
    });
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Failed to delete travel expense", error: error.message });
  }
};