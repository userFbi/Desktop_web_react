var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Temporary in-memory store (replace with DB later)
const users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// --- REGISTER ---
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ id: Date.now(), email, password: hashed });

  res.status(201).json({ message: 'User registered successfully' });
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Login successful', token });
});

// --- LOGOUT ---
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

module.exports = router;