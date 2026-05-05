const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    name: String,
    checks: [Boolean]
}, { timestamps: true });

module.exports = mongoose.model("Habit", habitSchema);