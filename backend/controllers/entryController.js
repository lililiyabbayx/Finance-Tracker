const { Entry, Category } = require('../model/Entry');
const ExpenseSummary = require('../model/expSum');
const Budget = require('../model/Budget');
const EmailAlert = require('../model/emailAlert');
const mongoose = require('mongoose');
const { seedCategoriesForUser } = require('../utils/categorySeeder');

// Get all categories for a user
const getCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    let categories = await Category.find({ userId });
    
    // If no categories exist, seed default categories
    if (!categories || categories.length === 0) {
      await seedCategoriesForUser(userId);
      categories = await Category.find({ userId });
    }
    
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    // Validate category name
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check for duplicate category
    const existingCategory = await Category.findOne({
      userId,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } // Case-insensitive match
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const newCategory = new Category({
      name: name.trim(),
      userId
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add a new entry
const addEntry = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const userId = req.user._id;

    console.log('Creating entry with data:', { type, amount, category, description, date, userId });

    // Create the new entry
    const newEntry = new Entry({
      type,
      amount: Number(amount),
      category: new mongoose.Types.ObjectId(category),
      description,
      date: new Date(date),
      userId: new mongoose.Types.ObjectId(userId)
    });

    const savedEntry = await newEntry.save();
    console.log('Entry saved:', savedEntry);

    // Populate the category information
    const populatedEntry = await Entry.findById(savedEntry._id)
      .populate('category', 'name')
      .exec();

    // Update expense summary if it's an expense
    if (type === 'expense') {
      const month = new Date(date).getMonth() + 1;
      let expenseSummary = await ExpenseSummary.findOne({ 
        userId: new mongoose.Types.ObjectId(userId), 
        month 
      });

      if (expenseSummary) {
        expenseSummary.totalExpense += Number(amount);
        if (!expenseSummary.categories) {
          expenseSummary.categories = new Map();
        }
        const categoryAmount = expenseSummary.categories.get(category) || 0;
        expenseSummary.categories.set(category, categoryAmount + Number(amount));
        await expenseSummary.save();
      } else {
        expenseSummary = new ExpenseSummary({
          userId: new mongoose.Types.ObjectId(userId),
          month,
          totalExpense: Number(amount),
          categories: new Map([[category, Number(amount)]])
        });
        await expenseSummary.save();
      }

      // Check budget
      const budget = await Budget.findOne({ 
        userId: new mongoose.Types.ObjectId(userId), 
        month 
      });

      if (budget && expenseSummary.totalExpense > budget.totalAmount) {
        // Send budget exceeded alert
        await sendEmailAlert({
          email: req.user.email,
          subject: 'Budget Exceeded',
          message: `Your expenses (${expenseSummary.totalExpense}) have exceeded your budget of ${budget.totalAmount} for this month.`
        });
      }
    }

    res.status(201).json(populatedEntry);
  } catch (error) {
    console.error('Error adding entry:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all entries for a user
const getEntries = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Getting entries for user:', userId);

    const entries = await Entry.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    })
    .populate('category', 'name')
    .sort({ date: -1 })
    .exec();

    console.log('Found entries:', entries);
    res.json(entries);
  } catch (error) {
    console.error('Error getting entries:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update an entry
const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const update = req.body;

    const updatedEntry = await Entry.findOneAndUpdate(
      { _id: id, userId },
      update,
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete an entry
const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const deletedEntry = await Entry.findOneAndDelete({ _id: id, userId });
    if (!deletedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get transaction statistics
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const entries = await Entry.find({ userId }).populate('category');
    
    // Calculate total income and expenses
    const stats = entries.reduce((acc, entry) => {
      if (entry.type === 'income') {
        acc.totalIncome += entry.amount;
      } else {
        acc.totalExpenses += entry.amount;
      }
      
      // Group by category
      const categoryName = entry.category.name;
      if (!acc.byCategory[categoryName]) {
        acc.byCategory[categoryName] = {
          total: 0,
          count: 0,
        };
      }
      acc.byCategory[categoryName].total += entry.amount;
      acc.byCategory[categoryName].count += 1;
      
      // Group by month
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc.byMonth[monthKey]) {
        acc.byMonth[monthKey] = {
          income: 0,
          expenses: 0
        };
      }
      if (entry.type === 'income') {
        acc.byMonth[monthKey].income += entry.amount;
      } else {
        acc.byMonth[monthKey].expenses += entry.amount;
      }

      // Group by week
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
      if (!acc.byWeek[weekKey]) {
        acc.byWeek[weekKey] = {
          income: 0,
          expenses: 0
        };
      }
      if (entry.type === 'income') {
        acc.byWeek[weekKey].income += entry.amount;
      } else {
        acc.byWeek[weekKey].expenses += entry.amount;
      }
      
      return acc;
    }, {
      totalIncome: 0,
      totalExpenses: 0,
      byCategory: {},
      byMonth: {},
      byWeek: {}
    });

    // Convert monthly data to array and sort
    stats.monthlyTrend = Object.entries(stats.byMonth)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months

    // Convert weekly data to array and sort
    stats.weeklyTrend = Object.entries(stats.byWeek)
      .map(([week, data]) => ({
        week,
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-8); // Last 8 weeks

    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addEntry,
  getEntries,
  updateEntry,
  deleteEntry,
  getCategories,
  createCategory,
  getStats,
};