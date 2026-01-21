// server.js

require("dotenv").config();
const express = require('express');
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("/*all", cors());



require("./seedTracks");

const tracksRouter = require('./routes/tracks');


app.use(cors({ origin: '*' }));

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
