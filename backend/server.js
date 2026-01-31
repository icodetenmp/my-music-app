// server.js

require("dotenv").config();
const express = require('express');
const cors = require("cors");

const app = express();

app.use(cors());

//debug
app.use((req, res, next) => {
    console.log('INCOMING REQUEST ');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Origin:', req.headers.origin);
    console.log('==============================');
    next();
});

require("./seedTracks");

const tracksRouter = require('./routes/tracks');



// Parse JSON bodies
app.use(express.json());

// Cloudinary handles all file hosting, no need for /uploads static routes

// Routes
app.use('/api/tracks', tracksRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
