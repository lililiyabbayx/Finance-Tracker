// Updated Income Model
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction", // Link to the Transaction model
      required: true,
    },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
  },
  {
    indexes: [{ userId: 1 }],
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
