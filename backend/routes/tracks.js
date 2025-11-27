const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //Store in correct subfolder based on fieldname
        const folder =
        file.fieldname === 'cover'
        ? 'covers'
        : file.fieldname === 'video'
        ? 'video'
        : 'audio';
        cb(null, path.resolve(__dirname, '../uploads/', folder));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); 
        const base = path
        .basename(file.originalname, ext)
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '');
        const uniqueName = `${Date.now()}-${base}${ext}`
        cb(null, uniqueName);
    },
});
const upload = multer({storage});

router.get('/', (req,res) =>{
    try{
    const rows = db.prepare('SELECT * FROM tracks').all();
    const BASE_URL = "http://localhost:5000";

    const tracksWithCovers = rows.map(track => ({
        ...track,
        coverPath: track.coverPath 
        ? `${BASE_URL}${track.coverPath}`
        : null,
        audioPath: track.audioPath 
        ? `${BASE_URL}${track.audioPath}`
        : null,

        videoPath: track.videoPath 
        ? `${BASE_URL}${track.videoPath}` 
        : null
    }));
    res.json(tracksWithCovers);
    }catch (err) {
        console.error("GET /api/tracks failed:", err.messsage);
        res.status(500).json({error: "failed to fetch tracks"});
    }
})


router.put('/:id', upload.fields([{name: 'cover', maxCount: 1}, {name: 'audio', maxCount: 1},{name: 'video', maxCount: 1}]),(req, res) =>{
    
    //console.log("REQ.FILES:", req.files);
    try{
        const {title, artist} = req.body;
        const id = req.params.id;
        
        if(!artist || !title){
            return res.status(400).json({error: 'Missing artist or title'});
        }

        //ACCESS UPLOADED FILES SAFELY
        const coverFile = req.files?.cover?.[0];
        const audioFile = req.files?.audio?.[0];
        const videoFile = req.files?.video?.[0];

        //BUILD NEW PATHS (ONLY IF NEW FILES ARE UPLOADED)
        const coverPath = coverFile ? `/uploads/covers/${coverFile.filename}`: null;
        const audioPath = audioFile ? `/uploads/audio/${audioFile.filename}` : null;
        const videoPath = videoFile? `/uploads/video/${videoFile.filename}` : null;

        console.log("Updating tracks:", {
            id,
            artist,
            title,
            coverPath,
            audioPath,
            videoPath
        });

        const stmt = db.prepare(`
            UPDATE tracks
            SET artist = ?, title = ?, 
            coverPath = COALESCE(?, coverPath),
             audioPath = COALESCE(?, audioPath),
             videoPath = COALESCE(?, videoPath)
            WHERE id = ?
            `);

           const result =  stmt.run(artist, title, coverPath,audioPath, videoPath, id);

           if (result.changes === 0){
            return res.status(404).json({error: 'Track not found' });
           }
            res.json({message: 'Track updated succesfuly!',
                coverPath,
                audioPath,
                videoPath
            });
        }catch (err){
            console.error('PUT/api/tracks failed:', err);
            res.status(500).json({error: 'Internal server error'});
        }
});
module.exports = router; 