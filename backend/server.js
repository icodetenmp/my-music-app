const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');
const tracksRouter = require('./routes/tracks');

//SERVE JSON
app.use(express.json());

//SERVE FRONT END
app.use(express.static(path.join(__dirname, '../backend/public')));

//serve backend
app.use(express.static(path.join(__dirname, '../backend')));

//serve covers
const coverPath = path.resolve(__dirname, 'uploads', 'covers');
app.use('/uploads/covers', express.static(coverPath));

//serve audio Files
const audioPath = path.resolve(__dirname, 'uploads', 'audio');
app.use('/uploads/audio', express.static(audioPath));

//serve video files
const videoPath = path.resolve(__dirname, 'uploads', 'video');
app.use('/uploads/video', express.static(videoPath));


//console.log('serving uploads form:', uploaddBase); 


//ROUTES
app.use('/api/tracks', tracksRouter);


app.get('/',(req, res) =>{
    res.send('API is runing');
} );

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ( )=> {
console.log(`server runing on port ${PORT}`);
 
});
 