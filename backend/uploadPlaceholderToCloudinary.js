const cloudinary = require('./cloudinary.js');
const fs = require('fs');
const path = require('path');
const { video, image } = require('./cloudinary');

async function uploadAllPlaceholders() {
  const result = {
    covers: [],
    audio: [],
    video: []
  };

  //Uploading covers 
  const coversDir = path.join(__dirname, 'uploads', 'covers');
  if (fs.existsSync(coversDir)) {
    const coverFile = fs.readdirSync(coversDir);

    for(const file of coverFile){
      const upload = await cloudinary.uploader.upload(
        path.join(coversDir, file),
        {
          folder: "covers",
          resource_type: 'image',
          public_id: path.parse(file).name
        }
      );
      result.covers.push(upload.secure_url);
      console.log('Cover uploaded:', upload.secure_url);
    }
  }

  //Uploading audios
  const audioDir = path.join(__dirname, 'uploads', 'audio');

  if (fs.existsSync(audioDir)) {
    const audioFiles = fs.readdirSync(audioDir);

    for(const file of audioFiles){
      const upload = await cloudinary.uploader.upload(
        path.join(audioDir, file),
        {
          folder: 'audio',
          resource_type: 'video',
          public_id: path.parse(file).name
        }
      );
      result.audio.push(upload.secure_url);
      console.log('Audio uploaded:', upload.secure_url);
    }
  }

  //Uploading video
  const videoDir = path.join(__dirname, 'uploads', 'video');
  if (fs.existsSync(videoDir)) {
    const videoFiles = fs.readdirSync(videoDir);

    for(const file of videoFiles){
      const upload = await cloudinary.uploader.upload(
        path.join(videoDir, file),
        {
          folder: "video",
          resource_type: 'video',
          public_id: path.parse(file).name
        }
      );
      result.video.push(upload.secure_url);
      console.log('Video uploaded:', upload.secure_url);
    }
  }

  //Fin
  console.log('\n===== Copy these URLs inti your DB =====\n');
  console.log(JSON.stringify(result, null, 2));

  return result;

}

uploadAllPlaceholders()
.then(() =>{
  console.log('\nALL placeholder uploades completed succesfully');
  process.exit(0);
})
.catch(err =>{
  console.error('Upload failed:', err);
  process.exit(1);
})