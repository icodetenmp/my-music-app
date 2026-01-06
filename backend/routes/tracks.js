const express = require('express');
const router = express.Router();
const db = require('../db');
const parser = require('../parser');

// GET all tracks
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM tracks').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

// UPDATE existing track
router.put(
  '/:id',
  parser.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const { artist, title } = req.body;
      const id = req.params.id;

      if (!artist || !title) {
        return res.status(400).json({ error: 'Missing artist or title' });
      }

      const coverFile = req.files?.cover?.[0];
      const audioFile = req.files?.audio?.[0];
      const videoFile = req.files?.video?.[0];

      const fields = ['artist = ?', 'title = ?'];
      const values = [artist, title];

      if (coverFile) {
        fields.push('coverPath = ?');
        values.push(coverFile.path);
      }

      if (audioFile) {
        fields.push('audioPath = ?');
        values.push(audioFile.path);
      }

      if (videoFile) {
        fields.push('videoPath = ?');
        values.push(videoFile.path);
      }

      values.push(id);

      db.prepare(`
        UPDATE tracks
        SET ${fields.join(', ')}
        WHERE id = ?
      `).run(...values);

      const updated = db.prepare('SELECT * FROM tracks WHERE id = ?').get(id);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  }
);

module.exports = router;
