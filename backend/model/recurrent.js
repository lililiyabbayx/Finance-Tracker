const mongoose = require("mongoose");

const recurrentEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Income", "Expense"]
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
    enum: ["Weekly", "Bi-Weekly", "Monthly", "Yearly"]
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Overdue", "Done"],
    default: "Pending"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("RecurrentEntry", recurrentEntrySchema);