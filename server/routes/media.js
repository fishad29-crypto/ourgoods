const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const mediaDir = path.join(__dirname, '../../public/media');

// Ensure directory exists
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mediaDir);
  },
  filename: function (req, file, cb) {
    // Generate unique name or keep original if safe
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});

const upload = multer({ storage: storage });

// POST - Upload file
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Construct response with file details
  res.json({
    id: req.file.filename,
    name: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    type: req.file.mimetype,
    url: `/media/${req.file.filename}` // Assuming Vite serves public/
  });
});

// GET - List all files
router.get('/', (req, res) => {
  fs.readdir(mediaDir, (err, files) => {
    if (err) {
      console.error("Error reading media directory", err);
      return res.status(500).json({ error: 'Failed to read media directory' });
    }

    const mediaFiles = files.map(filename => {
      const filePath = path.join(mediaDir, filename);
      const stats = fs.statSync(filePath);
      
      let type = 'unknown';
      const ext = path.extname(filename).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) type = 'image/*';
      else if (['.mp4', '.webm', '.ogg'].includes(ext)) type = 'video/*';
      
      return {
        id: filename,
        name: filename,
        filename: filename,
        size: stats.size,
        type: type,
        url: `/media/${filename}`
      };
    });

    res.json(mediaFiles);
  });
});

// DELETE - Remove file
router.delete('/:filename', (req, res) => {
  const filename = req.params.filename;
  // Basic security check to prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  
  const filePath = path.join(mediaDir, filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

module.exports = router;
