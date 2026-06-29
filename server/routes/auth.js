const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    console.log('REGISTER body:', { username, email, password });

    try {
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        console.log('Existing user:', existing);

        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashed });
        console.log('User saved:', newUser);

        res.status(201).json({ message: 'Account created successfully' });
    } catch (err) {
        console.log('REGISTER ERROR:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    console.log('1. Request received:', { identifier, password });

    try {
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        console.log('2. User found in DB:', user);

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        console.log('3. Password match:', match);

        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user: { username: user.username, email: user.email } });
    } catch (err) {
        console.log('4. Error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;