const express = require("express");
const router = express.Router();
const vault = require("../controllers/vaultController");

const verifyToken = require("../middleware/auth");

router.get("/", verifyToken, vault.getVault);
router.post("/add", verifyToken, vault.addVault);
router.delete("/delete/:id", verifyToken, vault.deleteVault);
router.patch("/update/:id", verifyToken, vault.updateVault);

module.exports = router;

