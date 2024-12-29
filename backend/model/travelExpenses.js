const mongoose = require("mongoose");

const travelExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Personal", "Business"],
  },
  category: {
    type: String,
    required: true,
    enum: ["Transportation", "Accommodation", "Meals", "Miscellaneous"],
  },
  subCategory: {
    type: String,
    required: true,
  },
  description: String,
  location: String,
  budget: {
    type: Number,
    required: true,
  },
  receiptImage: String,
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("TravelExpense", travelExpenseSchema);