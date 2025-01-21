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

app.use('/uploads', cors(), express.static('uploads'));
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    console.log('Origin:', req.headers.origin);
    console.log('Headers:', req.headers);
    next();
});


const parseRequestBody = (body) => {
    const parsedBody = {};

    for (const [key, value] of Object.entries(body)) {
        try {
            // Attempt to parse the value if it's a string
            parsedBody[key] = typeof value === 'string' ? JSON.parse(value) : value;
        } catch (error) {
            // If parsing fails, keep the original value
            parsedBody[key] = value;
        }
    }

    return parsedBody;
};

// Middleware to handle parsing
app.use((req, res, next) => {
    if (req.body) {
        req.body = parseRequestBody(req.body);
    }
    next();
});


app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use('/api/registration', registrationRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/payment', paymentRoutes);

module.exports = app;