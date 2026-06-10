const express = require("express");
const router = express.Router();
const note = require("../controllers/notesController");
const verifyToken = require("../middleware/auth");

router.get("/", verifyToken, note.getNotes);
router.post("/add", verifyToken, note.addNote);
router.put("/update/:id", verifyToken, note.updateNote);
router.delete("/delete/:id", verifyToken, note.deleteNote);
router.delete("/delete", verifyToken, note.deleteAllNotes);

module.exports = router;