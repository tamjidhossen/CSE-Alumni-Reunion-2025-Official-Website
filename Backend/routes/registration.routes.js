const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const alumniController = require('../controllers/alumni.controller.js');

router.post('/registration', upload.single('profilePictureInfo'), alumniController.addAlumni);

module.exports = router;