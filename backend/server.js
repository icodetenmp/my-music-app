// server.js

require("dotenv").config();
const express = require('express');
const cors = require("cors");

const app = express();

app.use(cors({
    origin: [
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'https://my-music-appp.onrender.com'
    ],
    methods: ["GET", "PUT"],
    allowedHeaders: ["Content-Type"],
}));

app.options('*', cors());


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
