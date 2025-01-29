const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connectToDb = require('./db/db.js');
connectToDb();
const cors = require('cors');
app.use(cors());
const registrationRoutes = require('./routes/registration.routes.js')
const announcementRoutes = require('./routes/announcement.routes.js')
const adminRoutes = require('./routes/admin.routes.js')
const studentRoutes = require('./routes/student.routes.js')
const alumniRoutes = require('./routes/alumni.routes.js')
const paymentRoutes = require('./routes/payment.routes.js')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/registration', registrationRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/uploads/images', express.static('uploads/images'));

module.exports = app;