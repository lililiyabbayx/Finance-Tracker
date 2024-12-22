const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const budgetController = require('../controllers/budgetController');
const emailAlertController = require('../controllers/emailAlertController');

// Entry routes
router.post('/entries', entryController.create);
router.get('/entries', entryController.getAll);
router.get('/entries/stats', entryController.getStats);
router.get('/entries/categories', entryController.getCategories);
router.post('/entries/categories', entryController.createCategory);

// Budget routes
router.post('/budgets', budgetController.setBudget);
router.get('/budgets/current', budgetController.getCurrentBudget);
router.get('/budgets/check', budgetController.checkBudget);

// Email alert routes
router.post('/email-alerts', emailAlertController.sendEmailAlertEndpoint);

module.exports = router;
