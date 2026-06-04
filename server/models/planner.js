const mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    day: String,
    hour: Number,
    value: String
})

module.exports = mongoose.model('Planner', plannerSchema);