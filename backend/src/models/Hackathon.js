const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    organizer: { type: String },
    deadline: { type: String },
    location: { type: String },
    source: { type: String },
    participants: { type: String },
    prize: { type: String },
    tags: [String],
    url: { type: String },
    category: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hackathon', hackathonSchema);
