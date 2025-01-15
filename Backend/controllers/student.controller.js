const fs = require('fs');
const path = require('path');
const Student = require('../models/student.model.js');

// Add new student
const addStudent = async (req, res) => {
    try {
        // Parse and validate data from the request body
        const jsonDataString = req.body.jsonData;
        const data = JSON.parse(jsonDataString);

        // Validate transaction ID
        const existingStudent = await Student.findOne({ 'paymentInfo.transactionId': data.paymentInfo.transactionId });
        if (existingStudent) {
            return res.status(400).json({ success: false, message: 'Transaction ID already exists' });
        }

        // Validate fees
        const totalFee = data.paymentInfo.totalAmount;
        const calculatedFee = data.paymentInfo.totalAmount; // Add fee calculation logic if needed

        if (calculatedFee !== totalFee) {
            return res.status(400).json({
                success: false,
                message: 'Total amount is incorrect',
                expectedFee: calculatedFee,
                providedFee: totalFee,
            });
        }

        // Prepare the student data for saving
        data.paymentInfo.status = 0;

        const student = new Student({
            personalInfo: data.personalInfo,
            contactInfo: data.contactInfo,
            paymentInfo: data.paymentInfo,
            profilePictureInfo: {}, // Placeholder for the image
        });

        // Save the student data to the database
        const savedStudent = await student.save();

        // Handle image saving after database insertion
        if (req.file) {
            const uploadDir = path.join(__dirname, '../uploads/images');
            const filePath = `${uploadDir}/${data.personalInfo.roll}_${Date.now()}-${req.file.originalname}`;

            // Ensure the upload directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Save the image file to the disk
            fs.writeFile(filePath, req.file.buffer, async (err) => {
                if (err) {
                    // Rollback database entry if the file saving fails
                    await Student.findByIdAndDelete(savedStudent._id);
                    return res.status(500).json({ success: false, message: 'Failed to save the image' });
                }

                // Update the student record with the image path
                savedStudent.profilePictureInfo.image = filePath;
                await savedStudent.save();

                res.status(201).json({
                    success: true,
                    message: 'Student registered successfully',
                    data: savedStudent,
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

module.exports = { addStudent };
