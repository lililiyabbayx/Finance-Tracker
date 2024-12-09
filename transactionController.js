import Transaction, { find } from ('../models/Transaction');

const addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await find({ userId: req.query.userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { addTransaction, getTransactions };
