const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');
const tracksRouter = require('./routes/tracks');

//SERVE JSON
app.use(express.json());


app.use('uploads/audio',
    express.static(path.join(__dirname, "uploads",
        'audio')));

app.use('/uploads/covers',
    express.static(path.join(__dirname, 'uploads/covers')));

    app.use('/uploads/video',
        express.static(path.join(__dirname, 'uploads/video')));

app.use(express.static(path.join(__dirname, 'public')));

//refresh
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

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
 