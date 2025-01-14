const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const announcementController = require('../controllers/announcement.controller.js');
const adminAuth = require('../middleware/adminAuth.middleware.js')
router.post('/add', adminAuth.authAdmin, announcementController.createAnnouncement);

module.exports = router;