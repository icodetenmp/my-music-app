// server.js
const express = require('express');
const app = express();
const tracksRouter = require('./routes/tracks');
const cors = require('cors');

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
