const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');
const tracksRouter = require('./routes/tracks');

//SERVE JSON
app.use(express.json());

//SERVE FRONTEND
app.use(express.static(path.join(__dirname, '../Frontend')));

//SERVE BACKEND
app.use(express.static(path.join(__dirname, '../backend')));

//SERVE COVERS
const coverPath = path.resolve(__dirname, 'uploads', 'covers');
app.use('/uploads/covers', express.static(coverPath));


//SERVE AUDIO FILES
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
const port = process.env.PORT || 5000;
app.listen(port, ( )=> {
console.log(`server runing on port ${port}`);
 
});
 