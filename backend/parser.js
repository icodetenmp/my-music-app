// parser.js
const multer = require('multer');

const storage = multer.memoryStorage();

module.exports = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // %0 limit
  }
});





/*const CloudinaryStorage = require('multer-storage-cloudinary'); // No curly braces
const cloudinary = require('./cloudinary'); // configured Cloudinary instance

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'audio';
    let resource_type = 'video'; // default for audio/video

    if (file.fieldname === 'cover') {
      folder = 'covers';
      resource_type = 'image';
    }
    if (file.fieldname === 'video') {
      folder = 'videos';
      resource_type = 'video';
    }

    return {
      folder: folder,
      resource_type: resource_type,
      public_id: Date.now() + '-' + file.originalname.replace(/\s+/g, '_')
    };
  }
});*/

module.exports = multer({ storage });
