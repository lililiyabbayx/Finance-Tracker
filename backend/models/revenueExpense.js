const mongoose = require('mongoose');

const revenueExpenseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['revenue', 'expense']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
revenueExpenseSchema.index({ userId: 1, date: -1 });
revenueExpenseSchema.index({ userId: 1, type: 1 });
revenueExpenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('RevenueExpense', revenueExpenseSchema);
