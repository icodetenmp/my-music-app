// resetTracks.js
const { video } = require('./cloudinary');
const db = require('./db'); // your existing db.js

// Replace these with your actual Cloudinary URLs
const cloudinaryData = {
  covers: [
    "https://res.cloudinary.com/dvp2cwhbz/image/upload/v1767686570/covers/placeholder1.jpg",
    "https://res.cloudinary.com/dvp2cwhbz/image/upload/v1767686571/covers/placeholder2.jpg",
    "https://res.cloudinary.com/dvp2cwhbz/image/upload/v1767686573/covers/placeholder3.jpg",
    "https://res.cloudinary.com/dvp2cwhbz/image/upload/v1767686575/covers/placeholder4.jpg",
    "https://res.cloudinary.com/dvp2cwhbz/image/upload/v1767686577/covers/placeholder5.jpg",
    "https://res.cloudinary.com/dvp2cwhbz/image/upload/v1767686579/covers/placeholder6.jpg",
    "https://res.cloudinary.com/dvp2cwhbz/image/upload/v1767686581/covers/placeholder7.jpg"

  ],
  audio: [
    "https://res.cloudinary.com/dvp2cwhbz/video/upload/v1767686657/audio/1762453847550-Sarz-Ft-Dj-Tunez-Flash-Get-Up-TrendyBeatzcom.mp3",
    "https://res.cloudinary.com/dvp2cwhbz/video/upload/v1767686661/audio/1762555335156-Sarz-Ft-Dj-Tunez-Flash-Get-Up-TrendyBeatzcom.mp3",
    "https://res.cloudinary.com/dvp2cwhbz/video/upload/v1767686680/audio/1762555561716-damages_mastering_instr.wav",
    "https://res.cloudinary.com/dvp2cwhbz/video/upload/v1767688462/audio/1763516408873-damages_mastering_instr.wav",
    "https://res.cloudinary.com/dvp2cwhbz/video/upload/v1767688470/audio/1764437159311-Sarz-Ft-Dj-Tunez-Flash-Get-Up-TrendyBeatzcom.mp3"
  ],

  video : [
     "https://res.cloudinary.com/dvp2cwhbz/video/upload/v1767688475/video/1763412652253-UPLOAD_YOUR.mp4"
  ]
  
};

db.exec("DELETE FROM tracks");

const insert = db.prepare(`
  INSERT INTO tracks (artist, title, audioPath, coverPath, videoPath)
  VALUES (?, ?, ?, ?, ?)
  `);

  for (let i = 0; 1< cloudinaryData.covers.length; i++){
    insert.run(
      'Unknown',
      'Track ${i + 1}',
      cloudinaryData.audio[0],
      cloudinaryData.covers[i],
      cloudinaryData.video[0]
    );
  }
  console.log("Tracks reset and synced with cloudinary uRLs");