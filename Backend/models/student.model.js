const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    personalInfo: {
        name: { type: String, required: true },
        roll: { type: Number, required: true },
        registrationNo: { type: Number, required: true },
        session: { type: String, required: true },
    },
    contactInfo: {
        mobile: { type: String, required: true },
        email: { type: String, required: true },
        currentAddress: { type: String, required: true }
    },
    paymentInfo: {
        totalAmount: { type: Number, required: true },
        mobileBankingName: { type: String, required: true },
        status: { type: Number, required: true },
        transactionId: { type: String, required: true }
    },
    profilePictureInfo: {
        image: { type: String, default: '' }
    }
}, { timestamps: true });

const student = mongoose.model('Student', studentSchema);

module.exports = student;
