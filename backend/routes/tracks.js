const express = require('express');
const router = express.Router();
const db = require('../db');
const parser = require('../parser.js');
const cloudinary = require('../cloudinary');

// GET all tracks

router.put('/:id', parser.any(), async (req, res) => {
  try {
    const { artist, title } = req.body;
    const id = req.params.id;

    const files = req.files || [];

    const coverFile = files.find(f => f.fieldname === "cover");
    const audioFile = files.find(f => f.fieldname === "audio");
    const videoFile = files.find(f => f.fieldname === "video");

    const fields = [];
    const values = [];

    if (artist) {
      fields.push("artist = ?");
      values.push(artist);
    }

    if (title) {
      fields.push("title = ?");
      values.push(title);
    }

    if (coverFile?.path) {
      fields.push("coverPath = ?");
      values.push(coverFile.path);
    }

    if (audioFile?.path) {
      fields.push("audioPath = ?");
      values.push(audioFile.path);
    }

    if (videoFile?.path) {
      fields.push("videoPath = ?");
      values.push(videoFile.path);
    }

    if (!fields.length) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    values.push(id);

    db.prepare(
      `UPDATE tracks SET ${fields.join(', ')} WHERE id = ?`
    ).run(values);

    const updatedTrack = db
      .prepare('SELECT * FROM tracks WHERE id = ?')
      .get(id);

    res.json(updatedTrack);
  } catch (err) {
    console.error("Updated error:", err);
    res.status(500).json({ error: 'Update Failed' });
  }
});


module.exports = router;