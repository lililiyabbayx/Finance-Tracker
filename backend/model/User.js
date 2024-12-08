const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "personal", "business"],
      required: true,
    },
  },
  {
    timestamps: true, // Ensures createdAt and updatedAt are automatically added to each document
  }
);

module.exports = mongoose.model("User", userSchema);
