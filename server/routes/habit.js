const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const habitController = require("../controllers/habitController");

router.use(protect);

router.get("/", habitController.getHabits);
router.post("/", habitController.addHabit);
router.put("/:id", habitController.updateHabit);
router.delete("/all", habitController.deleteAllHabits);
router.delete("/:id", habitController.deleteHabit);

module.exports = router;