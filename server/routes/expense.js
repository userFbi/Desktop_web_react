const express = require('express');
const router = express.Router();

const expenses = require('../controllers/expenseController');

// GET
router.get("/", expenses.getExpense);

// ADD
router.post("/add", expenses.addExpense);

// DELETE SINGLE ✅
router.delete("/delete/:id", expenses.deleteExpense);

// DELETE ALL ✅
router.delete("/clear", expenses.clearExpenses);

module.exports = router;