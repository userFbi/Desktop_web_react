const mongoose = require("mongoose");

const dayFlowSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // ← remove unique:true
    events: [String],
    savings: [{ amount: Number, date: String }],
    reminders: [String]
}, { timestamps: true });

module.exports = mongoose.model("DayFlow", dayFlowSchema);