const db = require("./db");

const insert = db.prepare(`INSERT INTO tracks (artist, title, audioPath, coverPath, videoPath)
    VALUES (?, ?, ?, ?, ?)
    `);
     for (let i = 1; i <= 6; i++){
            insert.run(
                'Unknown',
                'Empty Slot',
                'https://res.cloudinary.com/dvp2cwhbz/video/upload/v1767686657/audio/default.mp3',
                'https://res.cloudinary.com/dvp2cwhbz/image/upload/v1767686570/covers/placeholder${i}.jpg',
                'https://res.cloudinary.com/dvp2cwhbz/video/upload/v1767688475/video/1763412652253-UPLOAD_YOUR.mp4'

            );
        }
        console.log("inserted 6 cloudinary placeholder tracks");

