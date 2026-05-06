const express = require('express');
const router = express.Router();

const expenses = require('../controllers/expenseController');

router.get("/", expenses.getExpense);
router.post("/add", expenses.addExpense);
router.delete("/delete/:id", expenses.deleteExpense);
router.delete("/clear", expenses.clearExpenses);

module.exports = router;