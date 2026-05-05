const express = require("express");
const router = express.Router();

const habitController = require("../controllers/habitController");

router.get("/", habitController.getHabits);
router.post("/", habitController.addHabit);
router.put("/:id", habitController.updateHabit);
router.delete("/all", habitController.deleteAllHabits);
router.delete("/:id", habitController.deleteHabit);

module.exports = router;