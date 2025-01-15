const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const upload = require('../utils/upload.js'); // Your multer middleware

router.get('/', studentController.getStudents);
router.post('/update/:id', upload.single('profilePictureInfo'), studentController.updateStudent);
router.delete('/delete/:id', studentController.deleteStudent);

module.exports = router;
