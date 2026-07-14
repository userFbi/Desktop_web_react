const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET is not set in .env — using an insecure fallback. Set it before deploying.');
}
const SECRET = JWT_SECRET || 'dev-only-insecure-secret-change-me';

const signToken = (userId) =>
    jwt.sign({ id: userId }, SECRET, { expiresIn: '7d' });

// REGISTER
exports.register = async (req, res) => {
    try {
        let { username, email, password } = req.body;


        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are all required' });
        }

        email = email.trim().toLowerCase();
        username = username.trim();


        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            if (existing.email === email) {
                return res.status(409).json({ message: 'An account with this email already exists' });
            }
            return res.status(409).json({ message: 'This username is already taken' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashed });

        const token = signToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        // ✅ Catch race-condition duplicate key errors (E11000) instead of leaking raw Mongo errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];
            if (field === 'username') {
                return res.status(409).json({ message: 'This username is already taken' });
            }
            return res.status(409).json({ message: 'An account with this email already exists' });
        }
        if (error.name === 'ValidationError') {
            const firstError = Object.values(error.errors)[0].message;
            return res.status(400).json({ message: firstError });
        }
        console.error('Register error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        let { identifier, password } = req.body; // identifier = email OR username

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Email/username and password are required' });
        }

        identifier = identifier.trim();

        // ✅ detect whether the identifier looks like an email; if so, normalize to lowercase
        //    and match against email. Otherwise, treat it as a username and match exactly (case-sensitive).
        const isEmail = /^\S+@\S+\.\S+$/.test(identifier);

        const query = isEmail
            ? { email: identifier.toLowerCase() }
            : { username: identifier };

        const user = await User.findOne(query);
        // Generic message on purpose — never reveal whether the identifier exists or the password was wrong
        if (!user) return res.status(401).json({ message: 'Invalid email/username or password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid email/username or password' });

        const token = signToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// LOGOUT
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};