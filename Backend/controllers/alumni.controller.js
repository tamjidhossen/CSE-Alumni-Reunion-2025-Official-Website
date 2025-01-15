const fs = require('fs');
const path = require('path');
const Alumni = require('../models/alumni.model.js');

const addAlumni = async (req, res) => {
    try {
        const jsonDataString = req.body.jsonData;
        const data = JSON.parse(jsonDataString);

        // Validate transaction ID
        const existingAlumni = await Alumni.findOne({ 'paymentInfo.transactionId': data.paymentInfo.transactionId });
        if (existingAlumni) {
            return res.status(400).json({ success: false, message: 'Transaction ID already exists' });
        }

        // Validate fees
        const adultFee = Number(process.env.ADULT_FEE);
        const childFee = Number(process.env.CHILD_FEE);
        const childCount = data.numberOfParticipantInfo.child || 0;
        const adultCount = data.numberOfParticipantInfo.adult || 0;
        const totalFee = data.paymentInfo.totalAmount;
        const calculatedFee = (childCount * childFee) + (adultCount * adultFee);

        if (calculatedFee !== totalFee) {
            return res.status(400).json({
                success: false,
                message: 'Total amount is incorrect',
                expectedFee: calculatedFee,
                providedFee: totalFee,
            });
        }

        // Prepare for saving
        data.paymentInfo.status = 0;

        const alumni = new Alumni({
            personalInfo: data.personalInfo,
            contactInfo: data.contactInfo,
            professionalInfo: data.professionalInfo,
            prevProfessionalInfo: data.prevProfessionalInfo,
            numberOfParticipantInfo: data.numberOfParticipantInfo,
            paymentInfo: data.paymentInfo,
            profilePictureInfo: {}, // Placeholder for image
        });

        // Save the data in the database
        const savedAlumni = await alumni.save();

        // Handle image saving after database insertion
        if (req.file) {
            const uploadDir = path.join(__dirname, '../uploads/images');
            const filePath = `${uploadDir}/${data.personalInfo.roll}_${Date.now()}-${req.file.originalname}`;
            console.log(filePath)
            fs.writeFile(filePath, req.file.buffer, async (err) => {
                if (err) {
                    // Rollback database entry if file saving fails
                    await Alumni.findByIdAndDelete(savedAlumni._id);
                    return res.status(500).json({ success: false, message: 'Failed to save the image' });
                }

                // Update the alumni record with the image path
                savedAlumni.profilePictureInfo.image = filePath;
                await savedAlumni.save();

                res.status(201).json({
                    success: true,
                    message: 'Alumni registered successfully',
                    data: savedAlumni,
                });
            });
        } else {
            return res.status(400).json({ success: false, message: 'Profile picture is required' });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            details: error.message,
        });
    }
};

module.exports = { addAlumni };
