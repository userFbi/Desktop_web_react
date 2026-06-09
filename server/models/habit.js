const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  checks: [Boolean]
}, { timestamps: true });

module.exports = mongoose.model("Habit", habitSchema);