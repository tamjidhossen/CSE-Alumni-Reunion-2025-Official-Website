const fs = require('fs');
const path = require('path');
const Student = require('../models/student.model.js');
const emailService = require('../Services/mail.service.js')
// Add new student
const addStudent = async (req, res) => {
    try {
        Object.keys(req.body).forEach((key) => {
            try {
                // Try parsing the stringified JSON fields
                req.body[key] = JSON.parse(req.body[key]);
            } catch (error) {
                console.error(`Error parsing ${key}:`, error);
                // If parsing fails, you can keep the original value or handle the error accordingly
            }
        });
        // Parse and validate data from the request body
        const data = req.body;
        // Validate transaction ID
        // const existingStudent = await Student.findOne({ 'paymentInfo.transactionId': data.paymentInfo.transactionId });
        // if (existingStudent) {
        //     return res.status(400).json({ success: false, message: 'Transaction ID already exists' });
        // }

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
            profilePictureInfo: {},
        });

        // Save the student data to the database
        const savedStudent = await student.save();
        // Handle image saving after database insertion
        if (req.file) {
            const uploadDir = path.join(__dirname, '../../../uploads/images');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const filePath = `${uploadDir}/${data.personalInfo.roll}_${Date.now()}-${req.file.originalname}`;
            fs.writeFile(filePath, req.file.buffer, async (err) => {
                if (err) {
                    // Rollback database entry if file saving fails
                    await Student.findByIdAndDelete(savedStudent._id);
                    return res.status(500).json({ success: false, message: 'Failed to save the image' });
                }

                // Update the alumni record with the image path
                savedStudent.profilePictureInfo.image = filePath;
                await savedStudent.save();
                emailService.sendStudentConfirmationMail(data.contactInfo.email, "Successfully Registered!", savedStudent);
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

const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching students', error: error.message });
    }
};

// Update a student
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const updateData = JSON.parse(req.body.jsonData);

    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Handle image replacement
        if (req.file) {
            const uploadDir = path.join(__dirname, '../uploads/images');
            const newImagePath = `${uploadDir}/${updateData.personalInfo.roll}_${Date.now()}-${req.file.originalname}`;

            // Delete the old image if it exists
            if (student.profilePictureInfo.image) {
                try {
                    fs.unlinkSync(student.profilePictureInfo.image);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }

            // Save the new image
            fs.writeFileSync(newImagePath, req.file.buffer);
            updateData.profilePictureInfo = { image: newImagePath };
        }

        // Update the student record
        const updatedStudent = await Student.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ success: true, message: 'Student updated successfully', data: updatedStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating student', error: error.message });
    }
};

// Delete a student
const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Delete the profile picture if it exists
        if (student.profilePictureInfo.image) {
            try {
                fs.unlinkSync(student.profilePictureInfo.image);
            } catch (err) {
                console.error('Error deleting image:', err);
            }
        }

        // Delete the student record
        await Student.findByIdAndDelete(id);

        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting student', error: error.message });
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

        // Find the student by ID
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Update the payment status
        student.paymentInfo.status = Number(status);
        await student.save();

        const statusMessage = status === '1'
            ? 'Paid'
            : status === '0'
                ? 'Not Paid'
                : 'Rejected';
        if (status === '1') emailService.sendPaymentConfirmationMail(student.contactInfo.email, "Payment Update", student)
        else emailService.sendPaymentRejectionMail(student.contactInfo.email, "Payment Rejected", student)
        res.json({
            success: true,
            message: `Payment status updated to ${statusMessage}`,
            data: student
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
    const { roll, reg } = req.params;

    try {
        // Find student based on roll and registration number
        const student = await Student.findOne({
            'personalInfo.roll': roll,
            'personalInfo.registrationNo': reg
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        let statusMessage = '';
        switch (student.paymentInfo.status) {
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
            paymentStatus: student.paymentInfo.status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payment status',
            error: error.message,
        });
    }
};
module.exports = {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    paymentUpdate,
    paymentCheck
};
