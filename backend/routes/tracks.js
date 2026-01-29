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
  parser.any(), async(req, res) => {
    try {
      const { artist, title } = req.body;
      const id = req.params.id;

      const coverFile = req.files.find(f => f.fieldname === "cover");
      const audioFile = req.files.find(f => f.fieldname === "audio");
      const videoFile = req.files.find(f => f.fieldname === "video");
      
    
      const fields = [];
      const values = [];
//CLOUD UPLOAD
      if (artist){
        fields.push("artist = ?");
        values.push(artist);
      }
      if(title){
        fields.push("title = ?");
        values.push(title);
      }
      if (coverFile) {
        fields.push("coverPath = ?");
        values.push(coverFile.path);
      };

      if (audioFile) {
        fields.push('audioPath = ?');
        values.push(audioFile.path);
      }

      if (videoFile) {
        fields.push('videoPath = ?');
        values.push(videoFile.path);
      }

      if (!fields.length){
        return res.status(400).json({error: "NOthing to update"});
      }

      values.push(id);
      db.prepare (`UPDATE tracks SET ${fields.join(', ')} WHERE id = ?`).run(values)

      //send updated track back
      const updatedTrack = db.prepare('SELECT * FROM tracks WHERE id = ?').get(id);
      res.json(updatedTrack);
    } catch (err) {
      console.error("Updaated error:", err);
      res.status(500).json({ error: 'Update failed' });
    }
  }
);


module.exports = router;