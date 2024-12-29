const FinancialInsights = require("../model/insights");

exports.getFinancialInsights = async (req, res) => {
  try {
    const insights = await FinancialInsights.find();
    res.status(200).json(insights);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch financial insights", error });
  }
};