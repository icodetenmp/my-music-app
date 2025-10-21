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
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `);
    const rowCount = db.prepare('SELECT COUNT(*) as count FROM tracks').get().count;
    if (rowCount === 0){
        const insert = db.prepare(`INSERT INTO tracks (artist, title, audioPath, coverPath) VALUES (?, ?, ?, ?)` );

        for (let i = 1; i <= 6; i++){
            insert.run(
                'Unknown',
                'Empty Slot',
                '/uploads/audio/default.mp3',
                'uploads/covers/default.jpg'
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

    
    