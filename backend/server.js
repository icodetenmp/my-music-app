const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');
const tracksRouter = require('./routes/tracks');

//SERVE JSON
app.use(express.json());

//SERVE FRONT END
app.use(express.static(path.join(__dirname, 'public')));


//Serve uploads file
app.use('/uploads/covers', express.static(path.resolve(__dirname, 'uploads', 'covers')));
app.use('/uploads/audio', express.static(path.resolve(__dirname, 'uploads', 'audio')));
app.use('/uploads/video', express.static(path.resolve(__dirname, 'uploads', 'video')));



//ROUTES
app.use('/api/tracks', tracksRouter);


app.get('/',(req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
} );

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ( )=> {
console.log(`server runing on port ${PORT}`);
 
});
 