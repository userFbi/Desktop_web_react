const PLANNER = require('../models/planner');

// GET
exports.getPlanner = async (req, res) => {
    try {
        const data = await PLANNER.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SAVE / UPDATE
exports.savePlanner = async (req, res) => {
    try {
        const { day, hour, value } = req.body;

        const updated = await PLANNER.findOneAndUpdate(
            { day, hour },
            { value },
            { returnDocument: "after", upsert: true } // fixed warning also
        );

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE ONE CELL ✅
exports.deletePlanner = async (req, res) => {
    try {
        const { day, hour } = req.params;

        await PLANNER.deleteOne({ day, hour });

        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteAllPlanner = async (req, res) => {
    try {
        await PLANNER.deleteMany({});
        res.json({ message: "All planner data deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};