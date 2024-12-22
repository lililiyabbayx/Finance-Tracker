const Entry = require("../model/Entry");
const Budget = require("../model/Budget");
const ExpenseSummary = require("../model/expSum");

const generateFinancialReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    // Get all entries for the current month
    const entries = await Entry.find({
      userId,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      }
    });

    // Calculate totals
    const totalIncome = entries
      .filter(entry => entry.type === 'income')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalExpenses = entries
      .filter(entry => entry.type === 'expense')
      .reduce((sum, entry) => sum + entry.amount, 0);

    // Get budget information
    const budget = await Budget.findOne({ userId, month });
    const totalBudget = budget ? budget.totalAmount : 0;

    // Get category-wise expenses
    const expenseSummary = await ExpenseSummary.findOne({ userId, month });
    const categories = expenseSummary ? expenseSummary.categories : new Map();

    const report = {
      userId,
      month,
      year,
      totalIncome,
      totalExpenses,
      totalBudget,
      remainingBudget: totalBudget - totalExpenses,
      categories: Object.fromEntries(categories),
      date: new Date()
    };

    res.status(200).json({
      message: "Financial report generated successfully.",
      report,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Error generating financial report.", error: error.message });
  }
};

const getUserReports = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reports = await Report.find({ userId }).sort({ date: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports.", error: error.message });
  }
};

module.exports = { generateFinancialReport, getUserReports };
