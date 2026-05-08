const HABIT = require("../models/habit");

// GET all habits
exports.getHabits = async (req, res) => {
    try {
        const habits = await HABIT.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            data: habits
        });

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};


// ADD habit
exports.addHabit = async (req, res) => {
    try {
        const habit = await HABIT.create(req.body);

        res.status(201).json({
            status: "success",
            data: habit
        });

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};


// UPDATE habit
exports.updateHabit = async (req, res) => {
    try {
        const habit = await HABIT.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            status: "success",
            data: habit
        });

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};


// DELETE habit
exports.deleteHabit = async (req, res) => {
    try {
        await HABIT.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "success",
            message: "Habit deleted"
        });

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

// DELETE ALL habits
exports.deleteAllHabits = async (req, res) => {
    try {
        await HABIT.deleteMany({});

        res.status(200).json({
            status: "success",
            message: "All habits deleted"
        });

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};