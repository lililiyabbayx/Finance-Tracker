const express = require("express");
const router = express.Router();
const {
  setBudget,
  getCurrentBudget,
  checkBudget,
} = require("../controllers/budgetController");

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

// Budget routes
router.post("/", setBudget);
router.get("/current", getCurrentBudget);
router.get("/check", checkBudget);

module.exports = router;
