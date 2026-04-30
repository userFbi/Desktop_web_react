const express = require('express');
const router = express.Router();

const planner = require("../controllers/plannerController");

// GET DATA
router.get("/", planner.getPlanner);


// CREATE / SAVE DATA
router.post("/add", planner.savePlanner);

// DELETE DATA (Wipe_Database)
router.delete("/delete", planner.deletePlanner);

module.exports = router;


