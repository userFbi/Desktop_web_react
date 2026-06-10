const NOTE = require("../models/note");
const User = require("../models/user");

exports.getNotes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

        const notes = await NOTE.find({ userId: user._id }).sort({ createdAt: -1 });
        res.status(200).json({ status: "success", data: notes });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

exports.addNote = async (req, res) => {
    try {
        console.log("req.user:", req.user);
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

        const note = await NOTE.create({ ...req.body, userId: user._id });
        res.status(201).json({ status: "success", data: note });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

        const note = await NOTE.findOneAndUpdate(
            { _id: req.params.id, userId: user._id },
            req.body,
            { new: true }
        );
        res.status(200).json({ status: "success", data: note });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

        await NOTE.findOneAndDelete({ _id: req.params.id, userId: user._id });
        res.status(200).json({ status: "success", message: "Note deleted" });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};

exports.deleteAllNotes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

        await NOTE.deleteMany({ userId: user._id });
        res.status(200).json({ status: "success", message: "All notes deleted" });
    } catch (error) {
        res.status(500).json({ status: "fail", message: error.message });
    }
};