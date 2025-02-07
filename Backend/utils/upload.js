const multer = require('multer');
const FileType = require('file-type');
const path = require('path');
const crypto = require('crypto');

// Memory storage for security
const storage = multer.memoryStorage();

// Multer configuration
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: async (req, file, cb) => {
        try {
            const allowedMimeTypes = ['image/jpeg', 'image/png'];
            const allowedExts = ['.jpg', '.jpeg', '.png'];

            // Check file extension
            const fileExt = path.extname(file.originalname).toLowerCase();
            if (!allowedExts.includes(fileExt)) {
                return cb(new Error('Invalid file extension. Only .jpg, .jpeg, and .png are allowed.'), false);
            }

            // Check file type by reading file buffer (prevents renaming tricks)
            const fileBuffer = file.buffer;
            const fileType = await FileType.fromBuffer(fileBuffer);
            if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
                return cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
            }

            cb(null, true); // Accept file
        } catch (error) {
            cb(new Error('Error processing file upload.'), false);
        }
    }
});

module.exports = upload;
