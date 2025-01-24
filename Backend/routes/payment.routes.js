const express = require('express');
const router = express.Router();
const upload = require('../utils/upload.js');
const paymentController = require('../controllers/payment.controller.js');
const adminAuth = require('../middleware/adminAuth.middleware.js')
router.get('/check/:roll/:reg/:transactionId', paymentController.paymentCheck);
router.get('/Update/:transactionId/:status', adminAuth.authAdmin, paymentController.paymentUpdate);

module.exports = router;