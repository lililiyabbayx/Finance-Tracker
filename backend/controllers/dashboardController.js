const Entry = require("../model/Entry");
const Expense = require("../model/expSum");

const getDashboardSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const totalIncome = await Entry.aggregate([
      { $match: { userId, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      message: "Dashboard summary fetched successfully.",
      income: totalIncome[0]?.total || 0,
      expense: totalExpense[0]?.total || 0,
      savings: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { getDashboardSummary };
