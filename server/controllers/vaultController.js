const VAULT = require("../models/vault");
const User = require("../models/user");

// GET all entries
exports.getVault = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: "Fail", message: "User not found" });

        const vaults = await VAULT.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json(vaults);
    } catch (error) {
        res.status(500).json({ status: "Fail", message: error.message });
    }
};

// ADD entry
exports.addVault = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: "Fail", message: "User not found" });

        const { serviceName, username, password } = req.body;

        if (!serviceName || !username || !password) {
            return res.status(400).json({ status: "Fail", message: "All fields are required" });
        }

        const newEntry = new VAULT({
            userId: user._id,
            serviceName,
            username,
            password
        });

        await newEntry.save();

        res.json({ status: "Success", message: "Entry added successfully" });
    } catch (error) {
        res.status(500).json({ status: "Fail", message: error.message });
    }
};

// DELETE entry
exports.deleteVault = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: "Fail", message: "User not found" });

        await VAULT.findOneAndDelete({ _id: req.params.id, userId: user._id });

        res.json({ status: "Success", message: "Entry deleted" });
    } catch (error) {
        res.status(500).json({ status: "Fail", message: error.message });
    }
};

// UPDATE entry
exports.updateVault = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: "Fail", message: "User not found" });

        const { serviceName, username, password } = req.body;

        await VAULT.findOneAndUpdate(
            { _id: req.params.id, userId: user._id },
            { serviceName, username, password },
            { new: true }
        );

        res.json({ status: "Success", message: "Entry updated" });
    } catch (error) {
        res.status(500).json({ status: "Fail", message: error.message });
    }
};