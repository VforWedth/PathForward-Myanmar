const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['./uploads', './uploads/cv', './uploads/profile'];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = './uploads';

    if (file.fieldname === 'cv') {
      uploadPath = './uploads/cv';
    } else if (file.fieldname === 'profilePicture') {
      uploadPath = './uploads/profile';
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    cv: ['.pdf', '.doc', '.docx'],
    profilePicture: ['.jpg', '.jpeg', '.png', '.gif']
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const fieldname = file.fieldname;

  if (allowedTypes[fieldname] && allowedTypes[fieldname].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${fieldname}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = { upload };
