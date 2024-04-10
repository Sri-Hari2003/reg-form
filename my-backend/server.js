const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const User = require('./models/user');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });

app.use(express.json());
app.use('/auth', authRoutes); // This should come before the /signup route

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({ username: name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to my backend API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
