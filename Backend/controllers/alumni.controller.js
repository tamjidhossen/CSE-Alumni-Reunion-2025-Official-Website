const Alumni = require('../models/alumni.model.js');

const createAlumni = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }
        const jsonDataString = req.body.jsonData;
        const data = JSON.parse(jsonDataString);

        // console.log('Parsed JSON Data:', data);
        const existingAlumni = await Alumni.findOne({ 'paymentInfo.transactionId': data.paymentInfo.transactionId });
        if (existingAlumni) {
            return res.status(400).json({ success: false, message: 'Transaction ID already exists' });
        }
        data.profilePictureInfo.image = req.file.filename;

        const alumni = new Alumni({
            personalInfo: data.personalInfo,
            contactInfo: data.contactInfo,
            professionalInfo: data.professionalInfo,
            prevProfessionalInfo: data.prevProfessionalInfo,
            numberOfParticipantInfo: data.numberOfParticipantInfo,
            paymentInfo: data.paymentInfo,
            profilePictureInfo: data.profilePictureInfo
        });

        await alumni.save();

        res.status(201).json({
            success: true,
            data: alumni,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { createAlumni };
