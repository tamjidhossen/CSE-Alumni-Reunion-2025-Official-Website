const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const upload = require('../utils/upload.js'); // Your multer middleware
const adminAuth = require('../middleware/adminAuth.middleware.js')
router.get('/', adminAuth.authAdmin, studentController.getStudents);
router.post('/update/:id', adminAuth.authAdmin, upload.single('profilePictureInfo'), studentController.updateStudent);
router.delete('/delete/:id', adminAuth.authAdmin, studentController.deleteStudent);
router.put('/paymentUpdate/:id/:status', adminAuth.authAdmin, studentController.paymentUpdate);

module.exports = router;
