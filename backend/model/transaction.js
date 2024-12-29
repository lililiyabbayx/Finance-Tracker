const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  tag: { type: String },
  category: { type: String },
  type: { type: String, enum: ["income", "expense"], required: true },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
