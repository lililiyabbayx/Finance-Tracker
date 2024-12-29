const express = require("express");
const recurrentEntriesController = require("../controllers/recurrentEntries");
const isAuth = require("../middlewares/isAuth");

const recurrentEntriesRoutes = express.Router();

recurrentEntriesRoutes.get("/", isAuth, recurrentEntriesController.getRecurrentEntries);
recurrentEntriesRoutes.post("/", isAuth, recurrentEntriesController.createRecurrentEntry);
recurrentEntriesRoutes.put("/:id", isAuth, recurrentEntriesController.updateRecurrentEntry);
recurrentEntriesRoutes.delete("/:id", isAuth, recurrentEntriesController.deleteRecurrentEntry);

module.exports = recurrentEntriesRoutes;