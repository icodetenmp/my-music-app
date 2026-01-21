const express = require('express');
const router = express.Router();
const db = require('../db');
const parser = require('../parser');
const cloudinary = require('../cloudinary');

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
  async(req, res) => {
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
        const coverResult = await clouidinary.uploader.upload(
          coverFile.path,
          {folder: 'covers'}
        );
        fields.push('coverpath = ?');
        values.push(coverResult.secure_URL);
      }

     
      if (audioFile) {
        const audioResult = await clouidinary.uploader.upload(
          audioFile.path,
          {resource_type: 'video',
            folder: 'audio'}
        );
        fields.push('audioPath = ?');
        values.push(audioResult.secure_URL);
      }
      
      if (videoFile) {
        const videoResult = await clouidinary.uploader.upload(
          videoFile.path,
          {resource_type: 'video',
            folder: 'video'}
        );
        fields.push('videoPath = ?');
        values.push(videoResult.secure_URL);
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
