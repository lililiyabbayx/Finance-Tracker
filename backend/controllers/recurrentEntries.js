const RecurrentEntry = require("../model/recurrent");

exports.getRecurrentEntries = async (req, res) => {
  try {
    const entries = await RecurrentEntry.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recurrent entries", error });
  }
};

exports.createRecurrentEntry = async (req, res) => {
  try {
    const newEntry = new RecurrentEntry(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ message: "Failed to create recurrent entry", error });
  }
};

exports.updateRecurrentEntry = async (req, res) => {
  try {
    const updatedEntry = await RecurrentEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: "Failed to update recurrent entry", error });
  }
};

exports.deleteRecurrentEntry = async (req, res) => {
  try {
    await RecurrentEntry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Recurrent entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete recurrent entry", error });
  }
};