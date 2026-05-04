const express = require("express");
const router = express.Router();

const planner = require("../controllers/plannerController");

// routes
router.get("/", planner.getPlanner);
router.post("/add", planner.savePlanner);
router.delete("/delete", planner.deleteAllPlanner);
router.delete("/delete/:day/:hour", planner.deletePlanner);

module.exports = router;