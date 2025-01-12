const multer = require('multer');
const path = require('path');

// Set up storage options for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');  // Specify the folder where resumes will be saved
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Filter to allow only PDF or DOCX files for resumes
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only .pdf or .docx files are allowed!'), false);
  }
};

// Create the multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },  // Limit file size to 10MB
});

module.exports = upload;
