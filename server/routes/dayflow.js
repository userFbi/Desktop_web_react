const express = require("express");
const router = express.Router();

const dayflow = require("../controllers/dayflowController");

// 🔹 GET ALL (full state)
router.get("/", dayflow.getDayFlow);


// 🔹 EVENTS
router.post("/event/add", dayflow.addEvent);
router.delete("/event/delete/:date/:index", dayflow.deleteEvent);

// 🔹 SAVINGS
router.post("/savings/add", dayflow.addSavings);
router.delete("/savings/delete/:index", dayflow.deleteSaving);

// 🔹 REMINDERS
router.post("/reminder/add", dayflow.addReminder);
router.delete("/reminder/delete/:index", dayflow.deleteReminder);

// 🔹 RESET
router.delete("/reset", dayflow.resetDayFlow);

// 🔹 GET BY DATE (⚠️ ALWAYS KEEP LAST)
router.get("/:date", dayflow.getByDate);

module.exports = router;