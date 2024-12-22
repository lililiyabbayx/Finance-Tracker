const mongoose = require("mongoose");

const emailAlertSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      required: true,
    },
    messageId: {
      type: String,
    },
    budget: {
      type: Number,
    },
    spent: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'sent',
    },
    error: {
      type: String,
    },
  },
  { timestamps: true }
);

const EmailAlert = mongoose.model("EmailAlert", emailAlertSchema);

module.exports = EmailAlert;
