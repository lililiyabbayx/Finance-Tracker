const KPI = require("../model/KPI");

// Fetch all KPIs
const getKPIs = async (req, res) => {
  try {
    const kpis = await KPI.find();
    res.status(200).json(kpis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getKPIs };
