const express = require('express');
const { addTransaction, getTransactions } = require('../controllers/transactionController').default;
const router = express.Router();

router.route('/').post(addTransaction).get(getTransactions);

module.exports = router;
