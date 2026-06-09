const express = require('express');
const router = express.Router();
const expenses = require('../controllers/expenseController');
const protect = require('../middleware/auth'); // your existing JWT middleware

router.get("/", protect, expenses.getExpense);
router.post("/add", protect, expenses.addExpense);
router.delete("/delete/:id", protect, expenses.deleteExpense);
router.delete("/clear", protect, expenses.clearExpenses);

module.exports = router;