const express = require("express");
const financialWidgetsController = require("../controllers/financialWidgets");
const isAuth = require("../middlewares/isAuth");

const financialWidgetsRoutes = express.Router();

financialWidgetsRoutes.get("/api/v1/financial-widgets", isAuth, financialWidgetsController.getFinancialWidgets);
financialWidgetsRoutes.post("/api/v1/financial-widgets", isAuth, financialWidgetsController.createFinancialWidget);
financialWidgetsRoutes.put("/api/v1/financial-widgets/:id", isAuth, financialWidgetsController.updateFinancialWidget);
financialWidgetsRoutes.delete("/api/v1/financial-widgets/:id", isAuth, financialWidgetsController.deleteFinancialWidget);

module.exports = financialWidgetsRoutes;