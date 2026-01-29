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
//CLOUD UPLOAD
      if (coverFile) {
        const coverUpload = await cloudinary.uploader.upload(
          coverFile.path,
          { Folder: "music_cover"}
        );
        fields.push('coverPath = ?');
        values.push(coverUpload.secure_url);
      }

      if (audioFile) {
        const audioUpload = await cloudinary.uploader.upload(
          audioFile.path,
          { Folder: "music_audio",
            resource_type: "video"
          }
        );
        fields.push('audioPath = ?');
        values.push(audioUpload.secure_url);
      }

      if (videoFile) {
        const videoUpload = await cloudinary.uploader.upload(
          videoFile.path,
          { Folder: "music_video",
            resource_type: "video"
          }
        );
        fields.push('videoPath = ?');
        values.push(videoUpload.path);
      }

      values.push(id);

      const sql = `
        UPDATE tracks
        SET ${fields.join(', ')}
        WHERE id = ?
      `;

      db.prepare(sql).run(values);

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


/*
      let sql = 'UPDATE tracks SET artist =?, title =?';
      let params = [artist, title];

      if (coverFile){
        sql += ', coverPath = ?';
        params.push(coverFile.path);
      }
      if (audioFile){
        sql += ', audioPath = ?';
        params.push(audioFile.path);
      }
        
        if (videoFile){
        sql += ', videoPath = ?';
        params.push(videoFile.path);
        }

        sql += 'WHERE id = ?';
        params.push(id);

        console.log('SQL to exercute:', sql);
        console.log('parameters:', params);

        const result =db.prepare(sql).run(...params);

        if (result .changes === 0) {
          return res.status(404).json({error: 'Trcak not found'});
        }

        const Updated = db.prepare('SELECT * FROM tracks WHERE id = ?').get(id);

        return res.status(200).json(updated);

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Update failed'});
      }

      */