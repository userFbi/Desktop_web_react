const express = require('express');
const router = express.Router();
const User = require('../model/user'); // We will create this next
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER: Create a new user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: "USER_ALREADY_EXISTS" });

        // Scramble password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: "REGISTRATION_SUCCESS" });
    } catch (err) {
        res.status(500).send("SERVER_ERROR");
    }
});

// LOGIN: Verify user and give them a 'Session Token'
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: "INVALID_CREDENTIALS" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "INVALID_CREDENTIALS" });

        // Create JWT Token (Valid for 7 days)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user._id, username: user.username }
        });
    } catch (err) {
        res.status(500).send("SERVER_ERROR");
    }
});

module.exports = router;