const fs = require('fs');
const path = require('path');
const Alumni = require('../models/alumni.model.js');
const emailService = require('../Services/mail.service.js')
const addAlumni = async (req, res) => {
    try {
        Object.keys(req.body).forEach((key) => {
            try {
                console.log(key)
                // Try parsing the stringified JSON fields
                req.body[key] = JSON.parse(req.body[key]);
            } catch (error) {
                console.error(`Error parsing ${key}:`, error);
                // If parsing fails, you can keep the original value or handle the error accordingly
            }
        });

        const data = req.body;
        console.log(data);
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
                emailService.sendRegistrationMail(data.contactInfo.email, "Successfully Registered!", data);
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

const getAlumni = async (req, res) => {
    try {
        // Fetch all alumni from the database
        const alumni = await Alumni.find();
        // Return the alumni data
        res.status(200).json({
            success: true,
            data: alumni,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            details: error.message,
        });
    }
};



const updateAlumni = async (req, res) => {
    const { id } = req.params;
    const updateData = JSON.parse(req.body.jsonData);
    let newImagePath = '';
    try {
        const alumni = await Alumni.findById(id);
        if (!alumni) {
            return res.status(404).json({ success: false, message: 'Alumni not found' });
        }

        // Check if an image was uploaded
        if (req.file) {
            // If there's an existing image, delete it
            try {
                const oldImagePath = alumni.profilePictureInfo.image;
                fs.unlinkSync(oldImagePath); // Synchronously delete the old image
            } catch (err) {
                console.error('Error deleting old image:', err);
            }

            // Save the new image
            const uploadDir = path.join(__dirname, '../uploads/images');
            newImagePath = `${updateData.personalInfo.roll}_${Date.now()}-${req.file.originalname}`;
            const filePath = path.join(uploadDir, newImagePath);
            // Write the new file to the server
            fs.writeFile(filePath, req.file.buffer, async (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error saving new image' });
                }

                // Update the image path in the alumni object
                updateData.profilePictureInfo = { image: filePath };

                // Update the alumni with the new data (including the new image path)
                const updatedAlumni = await Alumni.findByIdAndUpdate(id, updateData, { new: true });

                res.json({
                    success: true,
                    message: "Alumni updated successfully",
                    updatedAlumni
                });
            });
        } else {
            // If no new image, proceed with just updating other data
            const updatedAlumni = await Alumni.findByIdAndUpdate(id, updateData, { new: true });

            res.json({
                success: true,
                message: "Alumni updated successfully",
                updatedAlumni
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating alumni', error: error.message });
    }
};

const deleteAlumni = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the alumni record by ID
        const alumni = await Alumni.findById(id);
        if (!alumni) {
            return res.status(404).json({ success: false, message: 'Alumni not found' });
        }

        // Check if the alumni has an associated image
        if (alumni.profilePictureInfo.image) {
            try {
                const imagePath = alumni.profilePictureInfo.image;
                fs.unlinkSync(imagePath); // Delete the image file synchronously
            } catch (err) {
                console.error('Error deleting image:', err);
                return res.status(500).json({ success: false, message: 'Error deleting image' });
            }
        }

        // Delete the alumni record from the database
        await Alumni.findByIdAndDelete(id);

        // Respond with success
        res.json({
            success: true,
            message: 'Alumni deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting alumni:', error);
        res.status(500).json({ success: false, message: 'Error deleting alumni', error: error.message });
    }
};
const paymentUpdate = async (req, res) => {
    const { id, status } = req.params;

    try {
        // Validate status input
        const validStatuses = [0, 1, 2];
        if (!validStatuses.includes(Number(status))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value. Use 0 for Not Paid, 1 for Paid, or 2 for Rejected.'
            });
        }

        // Find the alumni by ID
        const alumni = await Alumni.findById(id);
        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni not found'
            });
        }

        // Update the payment status
        alumni.paymentInfo.status = Number(status);
        await alumni.save();

        const statusMessage = status === '1'
            ? 'Paid'
            : status === '0'
                ? 'Not Paid'
                : 'Rejected';
        emailService.sendPaymentConfirmationMail(alumni.contactInfo.email, "Payment Update", alumni)
        console.log("send")
        res.json({
            success: true,
            message: `Payment status updated to ${statusMessage}`,
            data: alumni
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating payment status',
            error: error.message
        });
    }
};


const paymentCheck = async (req, res) => {
    const { roll, reg, transactionId } = req.params;

    try {
        // Find alumni based on roll, registration number, and transaction ID
        const alumni = await Alumni.findOne({
            'personalInfo.roll': roll,
            'personalInfo.registrationNo': reg,
            'paymentInfo.transactionId': transactionId,
        });

        if (!alumni) {
            return res.status(404).json({ success: false, message: 'Alumni not found or transaction ID mismatch' });
        }

        let statusMessage = '';
        switch (alumni.paymentInfo.status) {
            case 0:
                statusMessage = 'Pending';
                break;
            case 1:
                statusMessage = 'Paid';
                break;
            case 2:
                statusMessage = 'Rejected';
                break;
            default:
                statusMessage = 'Unknown status';
        }

        res.status(200).json({
            success: true,
            message: statusMessage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payment status',
            error: error.message,
        });
    }
};



module.exports = { addAlumni, getAlumni, updateAlumni, deleteAlumni, paymentUpdate, paymentCheck };
