const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement.controller.js');
const adminAuth = require('../middleware/adminAuth.middleware.js')
router.post('/add', adminAuth.authAdmin, announcementController.createAnnouncement);
router.get('/get-announcement', announcementController.getAnnouncements);
router.get('/update/:id', adminAuth.authAdmin, announcementController.updateAnnouncement);
router.delete('/delete/:id', adminAuth.authAdmin, announcementController.deleteAnnouncement);

module.exports = router;