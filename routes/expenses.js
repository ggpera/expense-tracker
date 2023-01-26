const express = require('express');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  getExpenseByMonth,
  getExpenseByCategory,
  updateExpense,
  deleteExpense,
} = require('../controller/expenses');

const router = express.Router();

router.get('/', getExpenses);
router.get('/filter', getExpenseByCategory);
router.get('/:id', getExpenseById);
router.get('/month/:i', getExpenseByMonth);
router.post('/', createExpense);
router.put('/', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
