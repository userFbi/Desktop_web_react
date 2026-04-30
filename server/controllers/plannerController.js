const PLANNER = require('../models/planner');

// GET all planner data
exports.getPlanner = async (req, res) => {
    try {
        const data = await PLANNER.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};

// SAVE / UPDATE cell
exports.savePlanner = async (req, res) => {
    try {
        // const { userID, day, hour, value } = req.body;
        const { day, hour, value } = req.body;
        console.log(req.body);
        const updated = await PLANNER.findOneAndUpdate(
            // { userID, day, hour }, // match
            { day, hour }, // match
            { value },
            { new: true, upsert: true } // 🔥 key part
        );

        res.json(updated);
    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};

// DELETE ALL DATA (Wipe_Database)
exports.deletePlanner = async (req, res) => {
    try {
        await PLANNER.deleteMany({});
        res.json({ message: "All planner data deleted." });
    }
    catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};
