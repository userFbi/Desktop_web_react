const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    body: String,
    folder: String
},
    { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);