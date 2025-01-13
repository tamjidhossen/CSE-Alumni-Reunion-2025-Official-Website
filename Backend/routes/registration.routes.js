const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const alumniController = require('../controllers/alumni.controller.js');

// POST route for creating alumni and handling image upload
router.post('/registration', upload.single('profilePictureInfo'), alumniController.createAlumni);

module.exports = router;