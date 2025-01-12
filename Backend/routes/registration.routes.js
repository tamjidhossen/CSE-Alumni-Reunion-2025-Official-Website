const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const alumniController = require('../controllers/alumni.controller.js');

// POST route for creating alumni and handling image upload
router.post('/alumni', upload.single('profilePicture'), alumniController.createAlumni);

module.exports = router;