const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    date: {
        type: String
    },
    monthYear: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);