const express = require('express');
const router = express.Router();
const vaultController = require('../controler/vault');

// GET all
router.get('/', vaultController.getVault);
// ADD
router.post('/add', vaultController.addVault);
// DELETE
router.delete('/:id', vaultController.deleteVault);

module.exports = router;