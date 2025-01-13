const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const announcementController = require('../controllers/announcement.controller.js');

router.post('/add', announcementController.createAnnouncement);

module.exports = router;