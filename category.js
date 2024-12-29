const Category = require("../models/Category");

// Add category
exports.addCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = new Category({ name, description });
        await category.save();
        res.status(201).json({ message: "Category added successfully", category });
    } catch (err) {
        res.status(500).json({ message: "Error adding category", error: err });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const updates = req.body;
    try {
        const category = await Category.findByIdAndUpdate(categoryId, updates, { new: true });
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category updated", category });
    } catch (err) {
        res.status(500).json({ message: "Error updating category", error: err });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting category", error: err });
    }
};
