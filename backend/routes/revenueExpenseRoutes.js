const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/isAuth');

// Import controller (we'll create this next)
const revenueExpenseController = require('../controllers/revenueExpenseController');

// Apply auth middleware to all routes
router.use(isAuth);

// Routes
router.post('/', revenueExpenseController.createEntry);
router.get('/', revenueExpenseController.getEntries);
router.get('/summary', revenueExpenseController.getSummary);
router.put('/:id', revenueExpenseController.updateEntry);
router.delete('/:id', revenueExpenseController.deleteEntry);

module.exports = router;
