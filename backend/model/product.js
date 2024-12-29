const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  expense: { type: Number, required: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
