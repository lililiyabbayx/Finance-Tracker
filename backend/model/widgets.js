const mongoose = require("mongoose");

const financialWidgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("FinancialWidget", financialWidgetSchema);