const mongoose = require("mongoose");

const scratchSchema = new mongoose.Schema({
    text: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Scratch", scratchSchema);