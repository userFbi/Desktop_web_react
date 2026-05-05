const express = require("express");
const router = express.Router();

const note = require("../controllers/noteController");


router.get("/", note.getNotes);
router.post("/add", note.addNote);
router.put("/update/:id", note.updateNote);
router.delete("/delete/:id", note.deleteNote);
router.delete("/delete", note.deleteAllNotes);

module.exports = router;