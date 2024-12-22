const express = require("express");
const router = express.Router();
const { sendEmailAlertEndpoint } = require("../controllers/emailAlertController");

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

// Email alert routes
router.post("/", sendEmailAlertEndpoint);

module.exports = router;
