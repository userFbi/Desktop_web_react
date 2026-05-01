const mongoose = require("mongoose");

const vaultSchema = new mongoose.Schema(
    {
        serviceName: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
    }
);

module.exports = mongoose.model("Vault", vaultSchema);