const mongoose = require('mongoose');

const VaultSchema = new mongoose.Schema({
    service: String,
    identity: String,
    key: String,
    type: { type: String, default: "SECURE" },
    userId: String // optional (for auth later)
});

module.exports = mongoose.model('vault', VaultSchema);