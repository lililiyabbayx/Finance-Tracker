const express = require("express");
const travelExpensesController = require("../controllers/travelExpenses");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

// Remove /api/v1/travel-expenses from routes since it's already specified in app.js
router.get("/", isAuth, travelExpensesController.getTravelExpenses);
router.post("/", isAuth, travelExpensesController.createTravelExpense);
router.put("/:id", isAuth, travelExpensesController.updateTravelExpense);
router.delete("/:id", isAuth, travelExpensesController.deleteTravelExpense);

module.exports = router;