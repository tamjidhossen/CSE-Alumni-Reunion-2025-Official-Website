const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const alumniController = require('../controllers/alumni.controller.js');
const studentController = require('../controllers/student.controller.js');

router.post('/alumni-registration', upload.single('profilePictureInfo'), alumniController.addAlumni);
router.post('/student-registration', studentController.addStudent);

module.exports = router;