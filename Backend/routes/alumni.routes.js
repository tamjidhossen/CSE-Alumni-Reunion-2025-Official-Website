const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumni.controller.js');
const upload = require('../utils/upload');
const adminAuth = require('../middleware/adminAuth.middleware.js')

router.get('/', alumniController.getAlumni);
router.post('/update/:id', adminAuth.authAdmin, upload.single('profilePictureInfo'), alumniController.updateAlumni);

module.exports = router;