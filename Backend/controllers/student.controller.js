const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const FileType = require('file-type');
const Student = require('../models/student.model.js');
const emailService = require('../Services/mail.service.js')
// Add new student
const dangerousPatterns = ['<?php', '<?=', '<script', 'system(', 'exec(', 'shell_exec', 'onerror=', 'alert('];

const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return dangerousPatterns.some(pattern => input.toLowerCase().includes(pattern)) ? null : input.trim();
    }
    return input;
};
const sanitizeString = (str) => {
    // Remove any HTML tags and potentially harmful characters
    return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').replace(/script|on\w+/gi, '');
};
const validateData = (data) => {
    // Check if required fields are missing
    if (!data.personalInfo || !data.contactInfo || !data.paymentInfo || !data.numberOfParticipantInfo) {
        return { valid: false, message: "Missing required fields" };
    }

    // Validate personalInfo
    if (!data.personalInfo.name || typeof data.personalInfo.name !== 'string' || data.personalInfo.name.length > 100) {
        return { valid: false, message: "Invalid name format" };
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    const sanitizedName = sanitizeString(data.personalInfo.name);

    if (!nameRegex.test(sanitizedName)) {
        return { valid: false, message: "Invalid name format (No special characters or scripts allowed)" };
    }

    if (!data.personalInfo.roll || typeof data.personalInfo.roll !== 'number') {
        return { valid: false, message: "Invalid roll number format" };
    }

    if (!data.personalInfo.registrationNo || typeof data.personalInfo.registrationNo !== 'number') {
        return { valid: false, message: "Invalid registration number format" };
    }

    if (!data.personalInfo.session || typeof data.personalInfo.session !== 'string' || data.personalInfo.session.length > 10) {
        return { valid: false, message: "Invalid session format" };
    }


    // Validate contactInfo
    if (!data.contactInfo.mobile || !/^[0-9]{11}$/.test(data.contactInfo.mobile)) {
        return { valid: false, message: "Invalid phone number format. Must be 11 digits." };
    }

    if (!data.contactInfo.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.contactInfo.email)) {
        return { valid: false, message: "Invalid email format" };
    }

    if (!data.contactInfo.currentAddress || typeof data.contactInfo.currentAddress !== 'string' || data.contactInfo.currentAddress.length > 255) {
        return { valid: false, message: "Invalid address format" };
    }
    const sanitizedAddress = sanitizeString(data.contactInfo.currentAddress);
    const addressRegex = /^[a-zA-Z0-9\s,.'\-\(\)\\\/#]+$/;
    if (!addressRegex.test(sanitizedAddress)) {
        return { valid: false, message: "Invalid address format (No harmful scripts or invalid characters allowed)" };
    }

    if (!data.numberOfParticipantInfo.adult || typeof data.numberOfParticipantInfo.adult !== 'number') {
        return { valid: false, message: "Invalid number of adults" };
    }

    if (typeof data.numberOfParticipantInfo.child !== 'number') {
        return { valid: false, message: "Invalid number of children" };
    }

    if (!data.numberOfParticipantInfo.total || typeof data.numberOfParticipantInfo.total !== 'number') {
        return { valid: false, message: "Invalid total number of participants" };
    }

    // Validate paymentInfo
    if (!data.paymentInfo.totalAmount || typeof data.paymentInfo.totalAmount !== 'number') {
        return { valid: false, message: "Invalid total amount" };
    }
    return { valid: true };
};

const addStudent = async (req, res) => {
    try {
        Object.keys(req.body).forEach((key) => {
            try {
                req.body[key] = JSON.parse(req.body[key]);
            } catch (error) {
                console.error(`Error parsing ${key}:`, error);
            }
        });

        const data = req.body;
        // Validate data
        const validationResult = validateData(data);

        if (!validationResult.valid) {
            return res.status(400).json({ success: false, message: validationResult.message });
        }

        // Sanitize inputs
        Object.keys(data).forEach((key) => {
            if (typeof data[key] === 'object') {
                Object.keys(data[key]).forEach((subKey) => {
                    data[key][subKey] = sanitizeInput(data[key][subKey]);
                });
            } else {
                data[key] = sanitizeInput(data[key]);
            }
        });

        if (Object.values(data).some(value => value === null)) {
            return res.status(400).json({ success: false, message: "Invalid or dangerous input detected" });
        }

        data.paymentInfo.status = 0;

        const student = new Student({
            personalInfo: data.personalInfo,
            contactInfo: data.contactInfo,
            paymentInfo: data.paymentInfo,
            profilePictureInfo: {},
        });

        const savedStudent = await student.save();

        // ✅ Securely Process Image Upload
        if (req.file) {
            const allowedMimeTypes = ["image/jpeg", "image/png"];
            const fileType = await FileType.fromBuffer(req.file.buffer);
            if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
                return res.status(400).json({ message: "Invalid file type. Only JPEG and PNG are allowed." });
            }

            const fileContent = req.file.buffer.toString('utf-8').toLowerCase();
            if (dangerousPatterns.some(pattern => fileContent.includes(pattern))) {
                await Student.findByIdAndDelete(savedStudent._id);
                return res.status(500).json({ success: false, message: 'Failed to save the image' });
            }

            const uploadDir = path.join(__dirname, '../uploads/images');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileExtension = fileType.ext;
            const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}_${data.personalInfo.roll}.${fileExtension}`;
            const filePath = path.join(uploadDir, uniqueFilename);
            const fileBuffer = req.file.buffer;

            fs.writeFile(filePath, fileBuffer, async (err) => {
                if (err) {
                    await Student.findByIdAndDelete(savedStudent._id);
                    return res.status(500).json({ success: false, message: 'Failed to save the image' });
                }

                savedStudent.profilePictureInfo.image = uniqueFilename;
                await savedStudent.save();

                return res.status(201).json({
                    success: true,
                    message: 'Student Form Submission successful',
                    data: savedStudent,
                });
            });
        } else {
            await Student.findByIdAndDelete(savedStudent._id);
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
            const newImagename = `${updateData.personalInfo.roll}_${Date.now()}-${req.file.originalname}`;
            const newImagePath = path.join(uploadDir, newImagename);

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
            updateData.profilePictureInfo = { image: newImagename };
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
        if (status === '1') emailService.sendStudentConfirmationMail(student.contactInfo.email, "Registration Confirmation", student)
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