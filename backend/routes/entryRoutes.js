const express = require("express");
const router = express.Router();
const {
  addEntry,
  getEntries,
  getStats,
  getCategories,
  createCategory,
} = require("../controllers/entryController");

// Temporary auth middleware for development
const tempAuthMiddleware = (req, res, next) => {
  // Set a temporary user ID for development
  req.user = {
    _id: "67603cd7ec53be790703d3f6",
  };
  next();
};

// Apply temporary auth middleware to all routes
router.use(tempAuthMiddleware);

// Transaction routes
router.post("/", addEntry);
router.get("/", getEntries);
router.get("/stats", getStats);

// Category routes
router.get("/categories", getCategories);
router.post("/categories", createCategory);

module.exports = router;
