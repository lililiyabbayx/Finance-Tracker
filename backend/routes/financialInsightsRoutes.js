const express = require("express");
const financialInsightsController = require("../controllers/financialInsights");
const isAuth = require("../middlewares/isAuth");

const financialInsightsRoutes = express.Router();

financialInsightsRoutes.get("/api/v1/financial-insights", isAuth, financialInsightsController.getFinancialInsights);

module.exports = financialInsightsRoutes;