const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const adminAuth = require('../middleware/adminAuth.middleware.js')
router.post('/register', adminAuth.authAdmin, adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
module.exports = router;