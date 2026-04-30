const mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema({
    day: String,
    hour: Number,
    value: String
})

module.exports = mongoose.model('Planner', plannerSchema);