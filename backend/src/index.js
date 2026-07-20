require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Hackathon = require('./models/Hackathon');
const { isHackathonClosed } = require('./utils/dateUtils');
const { cleanupExpiredHackathons } = require('./utils/cleanupExpired');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackathons';
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Successfully connected to MongoDB/hackathons');
        // Initial cleanup on startup
        await cleanupExpiredHackathons();
        // Schedule auto-cleanup every 1 hour (3600000 ms)
        setInterval(() => {
            cleanupExpiredHackathons().catch(err => console.error('Periodic cleanup error:', err));
        }, 3600000);
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "Backend is running!" });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});

// Manual Cleanup Endpoint - purges expired/closed hackathons
app.post('/api/hackathons/cleanup', async (req, res) => {
    try {
        const result = await cleanupExpiredHackathons();
        res.json({ message: "Cleanup completed successfully", ...result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.delete('/api/hackathons/cleanup', async (req, res) => {
    try {
        const result = await cleanupExpiredHackathons();
        res.json({ message: "Cleanup completed successfully", ...result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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

        let hackathons = await Hackathon.find(query)
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit));

        // Filter out closed/expired hackathons
        hackathons = hackathons.filter(h => !isHackathonClosed(h.deadline, h.title));

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

        let allHackathons = await Hackathon.find().sort({ createdAt: -1 });
        allHackathons = allHackathons.filter(h => !isHackathonClosed(h.deadline, h.title));

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
        const allHackathons = await Hackathon.find();
        const activeHackathons = allHackathons.filter(h => !isHackathonClosed(h.deadline, h.title));
        
        const sources = new Set(activeHackathons.map(h => h.source).filter(Boolean));
        const locations = new Set(activeHackathons.map(h => h.location).filter(Boolean));
        
        res.json({ total: activeHackathons.length, sources: sources.size, locations: locations.size });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

