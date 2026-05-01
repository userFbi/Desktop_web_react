const EXPENSE = require("../models/expense");

// GET ALL
exports.getExpense = async (req, res) => {
    try {
        const data = await EXPENSE.find().sort({ createdAt: -1 });

        res.json({
            status: "Success",
            data
        });

    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};


// ADD ENTRY
exports.addExpense = async (req, res) => {
    try {
        const { description, amount, type } = req.body;

        const now = new Date();

        const newEntry = new EXPENSE({
            description,
            amount,
            type,
            date: now.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
            }),
            monthYear: now.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
            })
        });

        await newEntry.save();

        res.json({
            status: "Success",
            message: "Entry Added"
        });

    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};


// DELETE ENTRY
exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        await EXPENSE.findByIdAndDelete(id);

        res.json({
            status: "Success",
            message: "Entry Deleted"
        });

    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};


// CLEAR ALL (wipe database)
exports.clearExpenses = async (req, res) => {
    try {
        await EXPENSE.deleteMany();

        res.json({
            status: "Success",
            message: "All Data Cleared"
        });

    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};