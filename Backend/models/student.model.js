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
        currentAddress: { type: String }
    },
    paymentInfo: {
        totalAmount: { type: Number, required: true },
        mobileBankingName: { type: String, default: '' },
        status: { type: Number, default: 0 },
        transactionId: { type: String, default: '' }
    },
    profilePictureInfo: {
        image: { type: String, default: '' }
    }
}, { timestamps: true });

const student = mongoose.model('Student', studentSchema);

module.exports = student;
