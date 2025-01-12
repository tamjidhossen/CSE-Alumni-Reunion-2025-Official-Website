const Alumni = require('../models/alumni.model.js');

const createAlumni = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }
        const {
            name,
            roll,
            registrationNo,
            session,
            passingYear,
            mobile,
            email,
            currentAddress,
            currentDesignation,
            currentOrganization,
            prevProfessionalInfo,
            adult,
            child,
            total,
            totalAmount,
            mobileBankingName,
            status,
            transactionId
        } = req.body;
        const existingAlumni = await Alumni.findOne({ 'paymentInfo.transactionId': transactionId });
        if (existingAlumni) {
            return res.status(400).json({ success: false, message: 'Transaction ID already exists' });
        }
        const imageFileName = req.file.filename;

        const alumni = new Alumni({
            personalInfo: {
                name,
                roll,
                registrationNo,
                session,
                passingYear
            },
            contactInfo: {
                mobile,
                email,
                currentAddress
            },
            professionalInfo: {
                currentDesignation,
                currentOrganization,
                to: 'Present'
            },
            prevProfessionalInfo,
            numberOfParticipantInfo: {
                adult,
                child,
                total
            },
            paymentInfo: {
                totalAmount,
                mobileBankingName,
                status,
                transactionId
            },
            profilePictureInfo: {
                image: imageFileName
            }
        });

        await alumni.save();
        res.status(201).json({
            success: true,
            data: alumni
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createAlumni };
