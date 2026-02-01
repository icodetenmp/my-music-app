const express = require('express');
const router = express.Router();
const db = require('../db');
const parser = require('../parser.js');
const cloudinary = require('../cloudinary');


router.use((req, res, next)=> {
  console.log('Route middleware hit:', req.method,req.url);
  console.log('About to call next()');
  next();
  console.log('After next() returned');
})
// GET all tracks
router.get('/', async (req, res) => {
  try{
    const tracks = await db.prepare('SELECT * FROM tracks').all();
    res.json(tracks);
  } catch (err){
    console.error('Get tracks error:', err);
    res.status(500).json({error: 'Failed to get tracks'});

  }
})

router.put('/:id', parser.any(), async (req, res) => {
  console.log('INSIDE ROUTE HANDLER');
  try {
    console.log('Upload request recieved');
    console.log('Track ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
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

    if (coverFile) {
      try{
        console.log('Uploading cover to Cloudinary...');
        const result = await new Promise((resolve, reject) => {
          const upLoadStream = cloudinary.uploader.upload_stream(
           { folder: 'covers', resource_type: 'image'},
           (error, result) => {
            if (error) reject(error);
            else resolve(result);
           }
          );
          upLoadStream.end(coverFile.buffer);
        });
        fields.push("coverPath = ?");
      values.push(result.secure_url);
      console.log('Cover uploaded:', result.secure_url);
      }catch (err) {
        console.error('Cover upload failed:', err);
      }
      
    }

     if (audioFile) {
      try{
        console.log('Uploading audio to Cloudinary...');
        const result = await new Promise((resolve, reject) => {
          const upLoadStream = cloudinary.uploader.upload_stream(
           { folder: 'audio', resource_type: 'video'},
           (error, result) => {
            if (error) reject(error);
            else resolve(result);
           }
          );
          upLoadStream.end(audioFile.buffer);
        });
        fields.push("audioPath = ?");
      values.push(result.secure_url);
      console.log('Audio uploaded:', result.secure_url);
      }catch (err) {
        console.error('Audio upload failed:', err);
      }
      
    }

     if (videoFile) {
      try{
        console.log('Uploading Video to Cloudinary...');
        const result = await new Promise((resolve, reject) => {
          const upLoadStream = cloudinary.uploader.upload_stream(
           { folder: 'video', resource_type: 'video'},
           (error, result) => {
            if (error) reject(error);
            else resolve(result);
           }
          );
          upLoadStream.end(videoFile.buffer);
        });
        fields.push("videoPath = ?");
      values.push(result.secure_url);
      console.log('Video uploaded:', result.secure_url);
      }catch (err) {
        console.error('Video upload failed:', err);
      }
      
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
    console.error('UPLOAD ERROR');
    console.error('Error message:', err.message);
    console.error('Error statck:', err.stack);
    res.status(500).json({ error: 'Update Failed', details: err.message });
  }
});
router.use((err, req, res, next) => {
  console.error('=====ROUTER ERROR=====');
  console.error(err);
  res.status(500).json({error: err.message});
});

module.exports = router;