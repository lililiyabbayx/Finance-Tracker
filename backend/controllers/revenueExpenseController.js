const RevenueExpense = require('../models/revenueExpense');

// Create new entry
exports.createEntry = async (req, res) => {
  try {
    const userId = req.user;
    const newEntry = new RevenueExpense({
      ...req.body,
      userId
    });
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ 
      message: 'Failed to create entry',
      error: error.message 
    });
  }
};

// Get all entries
exports.getEntries = async (req, res) => {
  try {
    const userId = req.user;
    const { startDate, endDate, type } = req.query;
    
    let query = { userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (type) {
      query.type = type;
    }
    
    const entries = await RevenueExpense.find(query).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch entries',
      error: error.message 
    });
  }
};

// Get summary
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user;
    const { startDate, endDate } = req.query;
    
    let dateMatch = {};
    if (startDate && endDate) {
      dateMatch = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    
    const summary = await RevenueExpense.aggregate([
      { $match: { userId, ...dateMatch } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const result = {
      revenue: 0,
      expenses: 0,
      profit: 0
    };
    
    summary.forEach(item => {
      if (item._id === 'revenue') {
        result.revenue = item.total;
      } else if (item._id === 'expense') {
        result.expenses = item.total;
      }
    });
    
    result.profit = result.revenue - result.expenses;
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch summary',
      error: error.message 
    });
  }
};

// Update entry
exports.updateEntry = async (req, res) => {
  try {
    const userId = req.user;
    const entryId = req.params.id;
    
    const updatedEntry = await RevenueExpense.findOneAndUpdate(
      { _id: entryId, userId },
      req.body,
      { new: true }
    );
    
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Entry not found or unauthorized' });
    }
    
    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({ 
      message: 'Failed to update entry',
      error: error.message 
    });
  }
};

// Delete entry
exports.deleteEntry = async (req, res) => {
  try {
    const userId = req.user;
    const entryId = req.params.id;
    
    const deletedEntry = await RevenueExpense.findOneAndDelete({
      _id: entryId,
      userId
    });
    
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entry not found or unauthorized' });
    }
    
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ 
      message: 'Failed to delete entry',
      error: error.message 
    });
  }
};
