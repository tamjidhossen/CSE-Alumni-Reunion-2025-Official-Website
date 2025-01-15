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
app.use(express.json());
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use('/api/registration', registrationRoutes);
app.use('/api/student', registrationRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;