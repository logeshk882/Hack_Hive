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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});

// Get hackathons with search, source filter, tag filter, pagination
app.get('/api/hackathons', async (req, res) => {
    try {
        const { search, source, tags, limit = 100, skip = 0 } = req.query;

        const query = {};

        if (source && source !== 'All') {
            query.source = { $regex: source, $options: 'i' };
        }

        if (tags) {
            const tagList = tags.split(',').map(t => t.trim());
            query.tags = { $in: tagList };
        }

        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            query.$or = [
                { title: searchRegex },
                { organizer: searchRegex },
                { location: searchRegex },
                { tags: searchRegex },
            ];
        }

        const hackathons = await Hackathon.find(query)
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit));

        res.json(hackathons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Categories endpoint - groups hackathons by tag categories
app.get('/api/hackathons/categories', async (req, res) => {
    try {
        const categoryMap = {
            'AI / ML': ['ai', 'ml', 'machine learning', 'artificial intelligence', 'deep learning', 'nlp', 'computer vision', 'data science'],
            'Web3 / Blockchain': ['blockchain', 'web3', 'defi', 'nft', 'crypto', 'solidity', 'smart contract'],
            'Cybersecurity': ['cybersecurity', 'security', 'ctf', 'hacking', 'penetration'],
            'Climate / Nature': ['climate', 'environment', 'green', 'sustainability', 'nature', 'carbon'],
            'Open Source': ['open source', 'oss', 'github', 'contribution'],
            'Design / UX': ['design', 'ux', 'ui', 'product design', 'creative'],
        };

        const allHackathons = await Hackathon.find().sort({ createdAt: -1 });

        const categorized = {};
        const matchedIds = new Set();

        for (const [category, keywords] of Object.entries(categoryMap)) {
            categorized[category] = allHackathons.filter(h => {
                const hackTags = (h.tags || []).map(t => t.toLowerCase());
                const title = (h.title || '').toLowerCase();
                return keywords.some(kw =>
                    hackTags.some(t => t.includes(kw)) || title.includes(kw)
                );
            });
            categorized[category].forEach(h => matchedIds.add(h._id.toString()));
        }

        categorized['General / Other'] = allHackathons.filter(h => !matchedIds.has(h._id.toString()));

        res.json(categorized);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
    try {
        const total = await Hackathon.countDocuments();
        const sources = await Hackathon.distinct('source');
        const locations = await Hackathon.distinct('location');
        res.json({ total, sources: sources.length, locations: locations.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
