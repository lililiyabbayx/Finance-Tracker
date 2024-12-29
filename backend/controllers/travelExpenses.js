const TravelExpense = require("../model/travelExpenses");

exports.getTravelExpenses = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from authenticated user
    const expenses = await TravelExpense.find({ userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch travel expenses", error });
  }
};

exports.createTravelExpense = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from authenticated user
    const newExpense = new TravelExpense({
      ...req.body,
      userId
    });
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
    const userId = req.user.id; // Get userId from authenticated user
    const updatedExpense = await TravelExpense.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: "Failed to update travel expense", error });
  }
};

exports.deleteTravelExpense = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from authenticated user
    const deletedExpense = await TravelExpense.findOneAndDelete({ 
      _id: req.params.id, 
      userId 
    });
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }
    res.status(200).json({ message: "Travel expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete travel expense", error });
  }
};