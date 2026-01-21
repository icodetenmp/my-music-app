 const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname,  'data.sqlite');
const db = new Database(dbPath);
db.exec(`
    CREATE TABLE IF NOT EXISTS tracks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist TEXT NOT NULL,
    title TEXT NOT NULL,
    audioPath TEXT NOT NULL,
    coverPath TEXT,
    videoPath TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `);
  
    module.exports = db;

    
    



































/*// db.js
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'data.sqlite');
const db = new Database(dbPath);

// Create table if it doesn’t exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tracks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist TEXT NOT NULL,
    title TEXT NOT NULL,
    audioPath TEXT NOT NULL,
    coverPath TEXT,
    videoPath TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Ensure videoPath column exists (for older DBs)
const columns = db.prepare("PRAGMA table_info(tracks)").all();
const hasVideoColumn = columns.some(c => c.name === 'videoPath');
if (!hasVideoColumn) {
  db.exec("ALTER TABLE tracks ADD COLUMN videoPath TEXT;");
  console.log("added videoPath column to tracks table");
}

// Check if table is empty, insert 6 placeholder tracks
const rowCount = db.prepare('SELECT COUNT(*) as count FROM tracks').get().count;
if (rowCount === 0) {
  const insert = db.prepare(`
    INSERT INTO tracks (artist, title, audioPath, coverPath, videoPath)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (let i = 1; i <= 6; i++) {
    insert.run(
      'Unknown',
      'Empty Slot',
      `https://res.cloudinary.com/Root/video/upload/default${i}.mp3`,
      `https://res.cloudinary.com/Root/image/upload/placeholder${i}.jpg`,
      `https://res.cloudinary.com/Root/video/upload/default${i}.mp4`
    );
  }

  console.log("Inserted 6 placeholder tracks with Cloudinary URLs");
}

// Optional: update existing tracks with unique placeholder covers
const update = db.prepare(`UPDATE tracks SET coverPath = ? WHERE id = ?`);
for (let i = 1; i <= 6; i++) {
  update.run(
    `https://res.cloudinary.com/Root/image/upload/placeholder${i}.jpg`,
    i
  );
}

console.log('Updated existing tracks with unique Cloudinary cover URLs');

module.exports = db;
*/