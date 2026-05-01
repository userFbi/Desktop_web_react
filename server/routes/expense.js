const express = require('express');
const router = express.Router();

const expenses = require('../controllers/expenseController');


router.get("/", expenses.getExpense);
router.post("/add", expenses.addExpense);
router.delete("/delete", expenses.deleteExpense);


module.exports = router;