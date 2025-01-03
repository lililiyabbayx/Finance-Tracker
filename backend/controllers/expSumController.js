const ExpenseSummary = require('../model/expSum');
const Budget = require('../model/Budget');
const { sendEmailAlert } = require("./emailAlertController");

const getExpenseSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const userId = req.user._id;

    // Get expense summary for the date range
    const summary = await ExpenseSummary.find({
      userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    

    // Calculate totals by category
    const categoryTotals = {};
    summary.forEach(record => {
      record.categories.forEach((amount, category) => {
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      });
    });

    // Get total expenses
    const totalExpenses = Object.values(categoryTotals).reduce((acc, curr) => acc + curr, 0);

    // Check budget if it's the current month
    const currentMonth = new Date().getMonth() + 1;
    const summaryMonth = new Date(startDate).getMonth() + 1;

    if (currentMonth === summaryMonth) {
      const budget = await Budget.findOne({ 
        userId, 
        month: currentMonth 
      });

      if (budget && totalExpenses > budget.totalAmount) {
        // Send budget exceeded alert
        await sendEmailAlert({
          email: req.user.email,
          subject: "Budget Alert",
          message: `Your expenses (${totalExpenses}) have exceeded your budget (${budget.totalAmount}) for this month.`
        });
      }
    }

    res.status(200).json({
      message: "Expense summary fetched successfully.",
      summary: {
        categoryTotals,
        totalExpenses,
        dateRange: { startDate, endDate }
      }
    });
  } catch (error) {
    console.error("Error fetching expense summary:", error);
    res.status(500).json({ 
      message: "Error fetching expense summary.",
      error: error.message 
    });
  }
};

module.exports = { getExpenseSummary };
