const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

module.exports = router;