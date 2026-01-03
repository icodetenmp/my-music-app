// routes/tracks.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const parser = require('../parser'); // Cloudinary parser

// GET all tracks
router.get('/', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM tracks').all();
        // Cloudinary URLs are already full URLs in DB, so send them as-is
        res.json(rows);
    } catch (err) {
        console.error("GET /api/tracks failed:", err.message);
        res.status(500).json({ error: "Failed to fetch tracks" });
    }
});

// PUT /api/tracks/:id → update track info + uploaded files
router.put('/:id', parser.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), (req, res) => {
    try {
        const { title, artist } = req.body;
        const id = req.params.id;

        if (!artist || !title) {
            return res.status(400).json({ error: 'Missing artist or title' });
        }

        // Get uploaded files from Cloudinary parser
        const coverFile = req.files?.cover?.[0];
        const audioFile = req.files?.audio?.[0];
        const videoFile = req.files?.video?.[0];

        console.log("Updating track:", { id, artist, title, coverFile, audioFile, videoFile });

        // Dynamically build fields to update
        const fieldsToUpdate = [];
        const values = [];

        fieldsToUpdate.push("artist = ?");
        values.push(artist);

        fieldsToUpdate.push("title = ?");
        values.push(title);

        if (coverFile) {
            fieldsToUpdate.push("coverPath = ?");
            values.push(coverFile.path); // Cloudinary URL
        }

        if (audioFile) {
            fieldsToUpdate.push("audioPath = ?");
            values.push(audioFile.path); // Cloudinary URL
        }

        if (videoFile) {
            fieldsToUpdate.push("videoPath = ?");
            values.push(videoFile.path); // Cloudinary URL
        }

        // Add ID for WHERE clause
        values.push(id);

        const stmt = db.prepare(`
            UPDATE tracks
            SET ${fieldsToUpdate.join(", ")}
            WHERE id = ?
        `);

        const result = stmt.run(...values);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Track not found' });
        }

        // Return updated track info
        const track = db.prepare("SELECT * FROM tracks WHERE id = ?").get(id);
        res.json(track);

    } catch (err) {
        console.error('PUT /api/tracks failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
