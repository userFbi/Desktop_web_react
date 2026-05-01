const express = require("express");
const router = express.Router();

const vault = require("../controllers/vaultController");

router.get("/", vault.getVault);
router.post("/add", vault.addVault);
router.delete("/delete/:id", vault.deleteVault);
router.patch("/update/:id", vault.updateVault);

module.exports = router;