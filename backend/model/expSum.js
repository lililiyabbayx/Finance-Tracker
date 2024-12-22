const mongoose = require("mongoose");

const expenseSummarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    totalExpense: {
      type: Number,
      default: 0,
    },
    categories: {
      type: Map,
      of: Number, // Example: { "food": 300, "transport": 200 }
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ExpenseSummary = mongoose.model("ExpenseSummary", expenseSummarySchema);

module.exports = ExpenseSummary;
