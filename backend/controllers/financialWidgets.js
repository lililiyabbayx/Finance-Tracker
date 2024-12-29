const FinancialWidget = require("../model/widgets");

exports.getFinancialWidgets = async (req, res) => {
  try {
    const widgets = await FinancialWidget.find();
    res.status(200).json(widgets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch financial widgets", error });
  }
};

exports.createFinancialWidget = async (req, res) => {
  try {
    const newWidget = new FinancialWidget(req.body);
    const savedWidget = await newWidget.save();
    res.status(201).json(savedWidget);
  } catch (error) {
    res.status(500).json({ message: "Failed to create financial widget", error });
  }
};

exports.updateFinancialWidget = async (req, res) => {
  try {
    const updatedWidget = await FinancialWidget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedWidget);
  } catch (error) {
    res.status(500).json({ message: "Failed to update financial widget", error });
  }
};

exports.deleteFinancialWidget = async (req, res) => {
  try {
    await FinancialWidget.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Financial widget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete financial widget", error });
  }
};