const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
    personalInfo: {
        name: { type: String, required: true },
        roll: { type: Number, required: true },
        registrationNo: { type: Number, required: true },
        session: { type: String, required: true },
        passingYear: { type: String, required: true }
    },
    contactInfo: {
        mobile: { type: String, required: true },
        email: { type: String, required: true },
        currentAddress: { type: String, required: true }
    },
    professionalInfo: {
        currentDesignation: { type: String, default: '' },
        currentOrganization: { type: String, default: '' },
        to: { type: String, default: 'Present' }
    },
    prevProfessionalInfo: [{
        currentDesignation: { type: String, default: '' },
        currentOrganization: { type: String, default: '' },
        to: { type: String, default: 'Present' }
    }],
    numberOfParticipantInfo: {
        adult: { type: Number, required: true },
        child: { type: Number, required: true },
        total: { type: Number, required: true }
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
});

const alumni = mongoose.model('Alumni', alumniSchema);

module.exports = alumni;
