const express = require("express");
const { getKPIs } = require("../controllers/kpiController");

const router = express.Router();

// Route to get KPI data
router.get("/kpis", getKPIs);

module.exports = router;
