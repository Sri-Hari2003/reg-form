const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const validPassword = await user.comparePassword(password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
