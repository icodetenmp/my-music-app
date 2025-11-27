const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'data.sqlite');
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
    const columns = db.prepare("PRAGMA table_info(tracks)").all();
    const hasVideoColumn = columns.some(c => c.name === 'videoPath');
    if(!hasVideoColumn){
        db.exec("ALTER TABLE tracks ADD COLUMN videoPath TEXT;");
        console.log("added videoPath column to track table");
    }
    const rowCount = db.prepare('SELECT COUNT(*) as count FROM tracks').get().count;
    if (rowCount === 0){
        const insert = db.prepare(`INSERT INTO tracks (artist, title, audioPath, coverPath, videoPath) VALUES (?, ?, ?, ?,?)` );

        for (let i = 1; i <= 6; i++){
            insert.run(
                'Unknown',
                'Empty Slot',
                '/uploads/audio/default.mp3',
                '/uploads/covers/default.jpg',
                '/uploads/videos/default.mp4'

            );
        }
        console.log("inserted 6 placeholder tracks");
    }
    const update = db.prepare(`UPDATE tracks SET coverPath = ? WHERE id = ?`);
    for(let i = 1; i <= 6; i++){
        update.run(`/uploads/covers/placeholder${i}.jpg`, i);
        
    }
    console.log('updating existing tracks with unique covers');
    module.exports = db;

    
    