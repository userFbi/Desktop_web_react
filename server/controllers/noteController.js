const NOTE = require("../models/note");

// GET all notes
exports.getNotes = async (req, res) => {
    try {
        const notes = await NOTE.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            data: notes
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

// ADD note
exports.addNote = async (req, res) => {
    try {
        const note = await NOTE.create(req.body);

        res.status(201).json({
            status: "success",
            data: note
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

// UPDATE note
exports.updateNote = async (req, res) => {
    try {
        const note = await NOTE.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            status: "success",
            data: note
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

// DELETE note
exports.deleteNote = async (req, res) => {
    try {
        await NOTE.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "success",
            message: "Note deleted"
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

// DELETE ALL notes
exports.deleteAllNotes = async (req, res) => {
    try {
        await NOTE.deleteMany({});

        res.status(200).json({
            status: "success",
            message: "All notes deleted"
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};