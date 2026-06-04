// routes/index.js
var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');  // import the middleware

// Public route — anyone can access
router.get('/', function (req, res) {
  res.send('Home Page');
});

// Protected route — only logged-in users can access
router.get('/dashboard', auth, function (req, res) {
  res.json({ message: `Welcome ${req.user.email}` });
  //                           ↑ auth middleware adds this automatically
});

module.exports = router;