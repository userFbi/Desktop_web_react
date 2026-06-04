const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // ← import auth
const dayflow = require("../controllers/dayflowController");

// ✅ Add auth to ALL routes
router.get("/", auth, dayflow.getDayFlow);
router.post("/event/add", auth, dayflow.addEvent);
router.delete("/event/delete/:date/:index", auth, dayflow.deleteEvent);
router.post("/savings/add", auth, dayflow.addSavings);
router.delete("/savings/delete/:index", auth, dayflow.deleteSaving);
router.post("/reminder/add", auth, dayflow.addReminder);
router.delete("/reminder/delete/:index", auth, dayflow.deleteReminder);
router.delete("/reset", auth, dayflow.resetDayFlow);
router.get("/:date", auth, dayflow.getByDate);
module.exports = router;