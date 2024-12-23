const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
  },
  {
    // Index for faster querying by userId
    indexes: [{ userId: 1 }],
  }
);

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;
