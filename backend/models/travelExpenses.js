const mongoose = require('mongoose');

const travelExpenseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    enum: ['Personal', 'Business']
  },
  category: {
    type: String,
    required: true,
    enum: ['Transportation', 'Accommodation', 'Meals', 'Miscellaneous']
  },
  subCategory: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
travelExpenseSchema.index({ userId: 1, date: -1 });
travelExpenseSchema.index({ userId: 1, category: 1 });
travelExpenseSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('TravelExpense', travelExpenseSchema);
