const mongoose = require("mongoose");

const scratchSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Scratch", scratchSchema);