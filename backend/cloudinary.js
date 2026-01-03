// backend/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "Root",
  api_key: "646364556385811",
  api_secret: "acmIkBKqv9CK6mHgfwouKm4Pzb0"
});

module.exports = cloudinary;



