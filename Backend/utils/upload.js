const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: (req, file, cb) => {
        const allowedExts = [".jpg", ".jpeg", ".png"];
        const fileExt = path.extname(file.originalname).toLowerCase();
        if (!allowedExts.includes(fileExt)) {
            return cb(new Error("Invalid file extension. Only .jpg, .jpeg, and .png are allowed."), false);
        }

        cb(null, true);
    }
});

module.exports = upload;
