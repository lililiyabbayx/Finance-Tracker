const mongoose = require("mongoose");

const financialInsightSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("FinancialInsight", financialInsightSchema);