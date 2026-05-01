const VAULT = require("../models/vault");

// GET all entries
exports.getVault = async (req, res) => {
    try {
        const vaults = await VAULT.find().sort({ createdAt: -1 });
        res.json(vaults);
    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};

// ADD entry
exports.addVault = async (req, res) => {
    try {
        const { serviceName, username, password } = req.body;

        if (!serviceName || !username || !password) {
            return res.status(400).json({
                status: "Fail",
                message: "All fields are required"
            });
        }

        const newEntry = new VAULT({
            serviceName,
            username,
            password
        });

        await newEntry.save();

        res.json({
            status: "Success",
            message: "Entry added successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};

// DELETE entry
exports.deleteVault = async (req, res) => {
    try {
        await VAULT.findByIdAndDelete(req.params.id);

        res.json({
            status: "Success",
            message: "Entry deleted"
        });

    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};

// UPDATE entry
exports.updateVault = async (req, res) => {
    try {
        const { serviceName, username, password } = req.body;

        await VAULT.findByIdAndUpdate(
            req.params.id,
            { serviceName, username, password },
            { new: true }
        );

        res.json({
            status: "Success",
            message: "Entry updated"
        });

    } catch (error) {
        res.status(500).json({
            status: "Fail",
            message: error.message
        });
    }
};