const express = require("express");
const expSumRouter = express.Router();
const { getExpenseSummary } = require("../controllers/expSumController");

// Route to fetch the expense summary within a date range
expSumRouter.get("/:userId/:startDate/:endDate", getExpenseSummary);

module.exports = expSumRouter;
