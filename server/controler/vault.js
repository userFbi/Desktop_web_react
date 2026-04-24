const Vault = require('../model/vault');

// ✅ GET all vault entries
exports.getVault = async (req, res) => {
    try {
        const data = await Vault.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ msg: "FETCH_ERROR" });
    }
};

// ✅ ADD new entry
exports.addVault = async (req, res) => {
    try {
        const { service, identity, key } = req.body;

        const newEntry = new Vault({
            service,
            identity,
            key,
            type: "SECURE"
        });

        await newEntry.save();

        res.status(201).json({ msg: "ENTRY_ADDED", data: newEntry });
    } catch (err) {
        res.status(500).json({ msg: "ADD_ERROR" });
    }
};

// ✅ DELETE entry
exports.deleteVault = async (req, res) => {
    try {
        const { id } = req.params;

        await Vault.findByIdAndDelete(id);

        res.json({ msg: "ENTRY_DELETED" });
    } catch (err) {
        res.status(500).json({ msg: "DELETE_ERROR" });
    }
};