const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadBase = path.resolve(__dirname, '../../uploads');
const uploadDirs = [uploadBase, path.join(uploadBase, 'cv'), path.join(uploadBase, 'profile')];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadBase;

    if (file.fieldname === 'cv') {
      uploadPath = path.join(uploadBase, 'cv');
    } else if (file.fieldname === 'profilePicture') {
      uploadPath = path.join(uploadBase, 'profile');
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '-') // Replace special characters with dashes
      .replace(/-+/g, '-') // Replace multiple dashes with single dash
      .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
    
    const filename = `${name || 'file'}-${uniqueSuffix}${ext}`;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  console.log('File filter check:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype
  });

  const allowedTypes = {
    cv: ['.pdf', '.doc', '.docx'],
    profilePicture: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const fieldname = file.fieldname;

  console.log('Extension check:', { ext, fieldname, allowed: allowedTypes[fieldname] });

  if (allowedTypes[fieldname] && allowedTypes[fieldname].includes(ext)) {
    console.log('File accepted');
    cb(null, true);
  } else {
    console.log('File rejected');
    cb(new Error(`Invalid file type for ${fieldname}. Got ${ext}, expected one of: ${allowedTypes[fieldname]?.join(', ')}`), false);
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
