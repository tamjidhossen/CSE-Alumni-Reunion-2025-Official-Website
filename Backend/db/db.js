const mongoose = require('mongoose');
const dbURI = process.env.DB_CONNECT;

function connectToDb() {
    mongoose.connect(dbURI)
        .then(() => {
            console.log('MongoDB connected successfully');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
}

module.exports = connectToDb;
