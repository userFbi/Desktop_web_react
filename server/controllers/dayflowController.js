const DayFlow = require("../models/dayflow");

// 🔹 GET ALL DATA
exports.getDayFlow = async (req, res) => {
    try {
        const data = await DayFlow.find().sort({ createdAt: -1 });

        res.json({
            status: "success",
            data
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};


// 🔹 GET BY DATE
exports.getByDate = async (req, res) => {
    try {
        const { date } = req.params;

        let data = await DayFlow.findOne({ date });

        // if no data, return empty structure
        if (!data) {
            return res.json({
                date,
                events: [],
                savings: [],
                reminders: []
            });
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};


// 🔹 ADD EVENT
exports.addEvent = async (req, res) => {
    try {
        const { date, event } = req.body;

        if (!date || !event) {
            return res.status(400).json({
                message: "date and event required"
            });
        }

        const doc = await DayFlow.findOneAndUpdate(
            { date },
            { $push: { events: event } },
            { new: true, upsert: true }
        );

        res.json({
            status: "success",
            data: doc
        });

    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};


// 🔹 DELETE EVENT
exports.deleteEvent = async (req, res) => {
    try {
        const { date, index } = req.params;

        const doc = await DayFlow.findOne({ date });

        if (!doc) {
            return res.status(404).json({
                message: "No data found for this date"
            });
        }

        if (!doc.events[index]) {
            return res.status(400).json({
                message: "Invalid index"
            });
        }

        doc.events.splice(index, 1);

        // remove doc if empty
        if (doc.events.length === 0 &&
            doc.savings.length === 0 &&
            doc.reminders.length === 0) {

            await DayFlow.deleteOne({ date });
            return res.json({ message: "Deleted completely" });
        }

        await doc.save();

        res.json({
            status: "success",
            data: doc
        });

    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};


// 🔹 ADD SAVINGS
exports.addSavings = async (req, res) => {
    try {
        const { amount, date } = req.body;

        if (!amount) {
            return res.status(400).json({
                message: "Amount required"
            });
        }

        const doc = await DayFlow.findOneAndUpdate(
            { date: "global" }, // global storage
            {
                $push: {
                    savings: {
                        amount,
                        date: date || new Date().toLocaleDateString("en-IN")
                    }
                }
            },
            { new: true, upsert: true }
        );

        res.json({
            status: "success",
            data: doc
        });

    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};


// 🔹 DELETE SAVINGS
exports.deleteSaving = async (req, res) => {
    try {
        const { index } = req.params;

        const doc = await DayFlow.findOne({ date: "global" });

        if (!doc) {
            return res.status(404).json({
                message: "No savings found"
            });
        }

        if (!doc.savings[index]) {
            return res.status(400).json({
                message: "Invalid index"
            });
        }

        doc.savings.splice(index, 1);
        await doc.save();

        res.json({
            status: "success",
            data: doc
        });

    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};


// 🔹 ADD REMINDER
exports.addReminder = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: "Reminder text required"
            });
        }

        const doc = await DayFlow.findOneAndUpdate(
            { date: "global" },
            { $push: { reminders: text } },
            { new: true, upsert: true }
        );

        res.json({
            status: "success",
            data: doc
        });

    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};


// 🔹 DELETE REMINDER
exports.deleteReminder = async (req, res) => {
    try {
        const { index } = req.params;

        const doc = await DayFlow.findOne({ date: "global" });

        if (!doc) {
            return res.status(404).json({
                message: "No reminders found"
            });
        }

        if (!doc.reminders[index]) {
            return res.status(400).json({
                message: "Invalid index"
            });
        }

        doc.reminders.splice(index, 1);
        await doc.save();

        res.json({
            status: "success",
            data: doc
        });

    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};


// 🔹 RESET ALL
exports.resetDayFlow = async (req, res) => {
    try {
        await DayFlow.deleteMany();

        res.json({
            status: "success",
            message: "All DayFlow data deleted"
        });

    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};