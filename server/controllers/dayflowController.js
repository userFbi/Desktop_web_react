const DayFlow = require("../models/dayflow");

// 🔹 GET ALL DATA
exports.getDayFlow = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await DayFlow.find({ userId }).sort({ createdAt: -1 });

        res.json({ status: "success", data });
    } catch (err) {
        res.status(500).json({ status: "fail", message: err.message });
    }
};

// 🔹 GET BY DATE
exports.getByDate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date } = req.params;

        let data = await DayFlow.findOne({ userId, date });

        if (!data) {
            return res.json({ date, events: [], savings: [], reminders: [] });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ status: "fail", message: err.message });
    }
};

// 🔹 ADD EVENT
exports.addEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date, event } = req.body;

        if (!date || !event) {
            return res.status(400).json({ message: "date and event required" });
        }

        const doc = await DayFlow.findOneAndUpdate(
            { userId, date },
            {
                $push: { events: event },
                $setOnInsert: { userId, date } // ← fixed
            },
            { new: true, upsert: true }
        );

        res.json({ status: "success", data: doc });
    } catch (err) {
        console.log("addEvent error:", err.message);
        res.status(500).json({ status: "fail", message: err.message });
    }
};

// 🔹 DELETE EVENT
exports.deleteEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { date, index } = req.params;

        const doc = await DayFlow.findOne({ userId, date });

        if (!doc) return res.status(404).json({ message: "No data found for this date" });
        if (!doc.events[index]) return res.status(400).json({ message: "Invalid index" });

        doc.events.splice(index, 1);

        if (doc.events.length === 0 && doc.savings.length === 0 && doc.reminders.length === 0) {
            await DayFlow.deleteOne({ userId, date });
            return res.json({ message: "Deleted completely" });
        }

        await doc.save();
        res.json({ status: "success", data: doc });
    } catch (err) {
        console.log("deleteEvent error:", err.message);
        res.status(500).json({ status: "fail", message: err.message });
    }
};

// 🔹 ADD SAVINGS
exports.addSavings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount } = req.body;

        if (amount === undefined || amount === null) {
            return res.status(400).json({ message: "Amount required" });
        }

        const doc = await DayFlow.findOneAndUpdate(
            { userId, date: "global" },
            {
                $push: { savings: { amount, date: new Date().toISOString().split("T")[0] } },
                $setOnInsert: { userId, date: "global" }
            },
            { returnDocument: 'after', upsert: true }
        );

        res.json({ status: "success", data: doc });
    } catch (err) {
        console.log("addSavings error:", err.message);
        res.status(500).json({ status: "fail", message: err.message });
    }
};

// 🔹 DELETE SAVINGS
exports.deleteSaving = async (req, res) => {
    try {
        const userId = req.user.id;
        const { index } = req.params;

        const doc = await DayFlow.findOne({ userId, date: "global" });

        if (!doc) return res.status(404).json({ message: "No savings found" });
        if (!doc.savings[index]) return res.status(400).json({ message: "Invalid index" });

        doc.savings.splice(index, 1);
        await doc.save();

        res.json({ status: "success", data: doc });
    } catch (err) {
        console.log("deleteSaving error:", err.message);
        res.status(500).json({ status: "fail", message: err.message });
    }
};

// 🔹 ADD REMINDER
exports.addReminder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { text } = req.body;

        if (!text) return res.status(400).json({ message: "Reminder text required" });

        const doc = await DayFlow.findOneAndUpdate(
            { userId, date: "global" },
            {
                $push: { reminders: text },
                $setOnInsert: { userId, date: "global" } // ← fixed
            },
            { new: true, upsert: true }
        );

        res.json({ status: "success", data: doc });
    } catch (err) {
        console.log("addReminder error:", err.message);
        res.status(500).json({ status: "fail", message: err.message });
    }
};

// 🔹 DELETE REMINDER
exports.deleteReminder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { index } = req.params;

        const doc = await DayFlow.findOne({ userId, date: "global" });

        if (!doc) return res.status(404).json({ message: "No reminders found" });
        if (!doc.reminders[index]) return res.status(400).json({ message: "Invalid index" });

        doc.reminders.splice(index, 1);
        await doc.save();

        res.json({ status: "success", data: doc });
    } catch (err) {
        console.log("deleteReminder error:", err.message);
        res.status(500).json({ status: "fail", message: err.message });
    }
};

// 🔹 RESET ALL — only delete current user's data
exports.resetDayFlow = async (req, res) => {
    try {
        const userId = req.user.id;
        await DayFlow.deleteMany({ userId });

        res.json({ status: "success", message: "All DayFlow data deleted" });
    } catch (err) {
        console.log("resetDayFlow error:", err.message);
        res.status(500).json({ status: "fail", message: err.message });
    }
};