const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');  

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    console.log('REGISTER body:', { username, password }); // ← add

    try {
        const existing = await User.findOne({ username });
        console.log('Existing user:', existing); // ← add

        if (existing) return res.status(400).json({ msg: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashed });
        console.log('User saved:', newUser); // ← add

        res.status(201).json({ msg: 'Account created successfully' });
    } catch (err) {
        console.log('REGISTER ERROR:', err.message); // ← add
        res.status(500).json({ msg: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('1. Request received:', { username, password }); // ← add

    try {
        const user = await User.findOne({ username });
        console.log('2. User found in DB:', user); // ← add

        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        console.log('3. Password match:', match); // ← add

        if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, username: user.username });
    } catch (err) {
        console.log('4. Error:', err.message); // ← add
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;