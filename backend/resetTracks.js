// resetTracks.js
const db = require('./db'); // your existing db.js

// Replace these with your actual Cloudinary URLs
const tracks = [
  { id: 1, cover: "https://res.cloudinary.com/rootr/image/upload/v12345-placeholder1.jpg", audio: "https://res.cloudinary.com/Root/video/upload/v12345-track1.mp3" },
  { id: 2, cover: "https://res.cloudinary.com/rootr/image/upload/v12345-placeholder2.jpg", audio: "https://res.cloudinary.com/Root/video/upload/v12345-track2.mp3" },
  { id: 3, cover: "https://res.cloudinary.com/rootr/image/upload/v12345-placeholder3.jpg", audio: "https://res.cloudinary.com/Root/video/upload/v12345-track3.mp3" },
  { id: 4, cover: "https://res.cloudinary.com/rootr/image/upload/v12345-placeholder4.jpg", audio: "https://res.cloudinary.com/Root/video/upload/v12345-track4.mp3" },
  { id: 5, cover: "https://res.cloudinary.com/rootr/image/upload/v12345-placeholder5.jpg", audio: "https://res.cloudinary.com/Root/video/upload/v12345-track5.mp3" },
  { id: 6, cover: "https://res.cloudinary.com/rootr/image/upload/v12345-placeholder6.jpg", audio: "https://res.cloudinary.com/Root/video/upload/v12345-track6.mp3" }
];

tracks.forEach(track => {
  const stmt = db.prepare(`
    UPDATE tracks
    SET coverPath = ?, audioPath = ?
    WHERE id = ?
  `);
  stmt.run(track.cover, track.audio, track.id);
});

console.log("All tracks reset to Cloudinary URLs!");
