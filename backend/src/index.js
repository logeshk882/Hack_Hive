require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Hackathon = require('./models/Hackathon');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackathons';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB/hackathons'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "Backend is running!" });
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});

app.get('/api/hackathons', async (req, res) => {
    try {
        const hackathons = await Hackathon.find().sort({ createdAt: -1 });
        res.json(hackathons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
