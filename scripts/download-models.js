const https = require('https');
const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'public', 'models');

const modelFiles = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1'
];

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

async function downloadFile(filename) {
  const filePath = path.join(modelsDir, filename);
  const file = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    https.get(`${baseUrl}/${filename}`, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(filePath);
      reject(err);
    });
  });
}

async function downloadModels() {
  try {
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    for (const file of modelFiles) {
      await downloadFile(file);
    }
    console.log('All models downloaded successfully!');
  } catch (error) {
    console.error('Error downloading models:', error);
  }
}

downloadModels();
