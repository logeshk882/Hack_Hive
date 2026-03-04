require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data
const allHackathons = [
    {
        title: "MIT Reality Hack 2026",
        organizer: "MIT Media Lab",
        deadline: "2026-03-25",
        participants: "1.5K+",
        prize: "$75K",
        tags: ["AR / VR", "XR", "AI"],
        location: "Boston, USA",
        source: "Devpost",
    },
    {
        title: "Smart India Hackathon",
        organizer: "Govt. of India",
        deadline: "2026-04-30",
        participants: "50K+",
        prize: "₹25L",
        tags: ["Civic Tech", "AI / ML", "IoT"],
        location: "India (Multiple Cities)",
        source: "Knowafest",
    }
];

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "Backend is running!", count: allHackathons.length });
});

// Example API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});

app.get('/api/hackathons', (req, res) => {
    res.json(allHackathons);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
