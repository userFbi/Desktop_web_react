const mongoose = require("mongoose");

const dayFlowSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true },

    events: [String],

    savings: [
        {
            amount: Number,
            date: String
        }
    ],

    reminders: [String]

}, { timestamps: true });

module.exports = mongoose.model("DayFlow", dayFlowSchema);