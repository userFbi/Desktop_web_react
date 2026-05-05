const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        title: String,
        body: String,
        folder: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);