const express = require("express");
const router = express.Router();

const scratch = require("../controllers/scratchController");

router.get("/", scratch.getScratch);
router.post("/save", scratch.saveScratch);

module.exports = router;