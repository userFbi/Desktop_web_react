const Scratch = require("../models/scratch");

// 🔹 GET scratchpad
exports.getScratch = async (req, res) => {
    try {
        const doc = await Scratch.findOne();

        res.json({
            status: "success",
            text: doc?.text || ""
        });

    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};

// 🔹 SAVE scratchpad
exports.saveScratch = async (req, res) => {
    try {
        const { text } = req.body;

        if (text === undefined) {
            return res.status(400).json({
                message: "Text is required"
            });
        }

        // only ever one document
        const doc = await Scratch.findOneAndUpdate(
            {},
            { text },
            { upsert: true, new: true }
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