const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connectToDb = require('./db/db.js');
connectToDb();
const cors = require('cors');
app.use(cors());
const registrationRoutes = require('./routes/registration.routes.js')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use('/api/registration', registrationRoutes);

module.exports = app;