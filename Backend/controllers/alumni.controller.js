const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const FileType = require('file-type');
const Alumni = require('../models/alumni.model.js');
const emailService = require('../Services/mail.service.js')
const dangerousPatterns = [
    '<script', '<?php', '<?=', 'system(', 'exec(', 'shell_exec', 'alert(', 'onerror='
];

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

    // Validate professionalInfo
    if (data.professionalInfo.currentDesignation && !nameRegex.test(sanitizeString(data.professionalInfo.currentDesignation))) {
        return { valid: false, message: "Invalid current designation format (No special characters or scripts allowed)" };
    }

    if (data.professionalInfo.currentOrganization && !nameRegex.test(sanitizeString(data.professionalInfo.currentOrganization))) {
        return { valid: false, message: "Invalid current organization format (No special characters or scripts allowed)" };
    }


    // Validate prevProfessionalInfo (previous professional experience)
    if (data.prevProfessionalInfo && Array.isArray(data.prevProfessionalInfo)) {
        for (const prevJob of data.prevProfessionalInfo) {
            if (prevJob.designation && !nameRegex.test(sanitizeString(prevJob.designation))) {
                return { valid: false, message: "Invalid designation in previous professional info (No special characters or scripts allowed)" };
            }

            if (prevJob.organization && !nameRegex.test(sanitizeString(prevJob.organization))) {
                return { valid: false, message: "Invalid organization name in previous professional info (No special characters or scripts allowed)" };
            }
        }
    }

    // Validate numberOfParticipantInfo
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

    if (!data.paymentInfo.mobileBankingName || typeof data.paymentInfo.mobileBankingName !== 'string') {
        return { valid: false, message: "Invalid mobile banking name" };
    }

    if (!data.paymentInfo.transactionId || typeof data.paymentInfo.transactionId !== 'string') {
        return { valid: false, message: "Invalid transaction ID" };
    }
    return { valid: true };
};

const addAlumni = async (req, res) => {
    try {
        Object.keys(req.body).forEach((key) => {
            try {
                req.body[key] = JSON.parse(req.body[key]);
            } catch (error) {
                console.error(`Error parsing ${key}:`, error);
            }
        });

        const data = req.body;
        console.log(data)
        // Validate data structure
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

        // Validate Fees
        const adultFee = Number(process.env.ADULT_FEE);
        const childFee = Number(process.env.CHILD_FEE);
        const childCount = data.numberOfParticipantInfo.child || 0;
        const adultCount = data.numberOfParticipantInfo.adult || 0;
        const totalFee = data.paymentInfo.totalAmount;
        let calculatedFee = (childCount * childFee) + (adultCount * adultFee) + 1000;
        console.log(childCount);
        console.log(childFee);
        console.log(adultCount);
        console.log(adultFee);
        console.log(calculatedFee);
        console.log(totalFee);

        if (["2019-2020", "2018-2019"].includes(data.personalInfo.session)) {
            calculatedFee = 1000 * adultCount + childCount * 500;
        }

        if (calculatedFee !== totalFee) {
            return res.status(400).json({
                success: false,
                message: 'Total amount is incorrect',
                expectedFee: calculatedFee,
                providedFee: totalFee,
            });
        }

        const alumni = new Alumni({
            personalInfo: data.personalInfo,
            contactInfo: data.contactInfo,
            professionalInfo: data.professionalInfo,
            prevProfessionalInfo: data.prevProfessionalInfo,
            numberOfParticipantInfo: data.numberOfParticipantInfo,
            paymentInfo: { ...data.paymentInfo, status: 0 },
            profilePictureInfo: {},
        });

        const savedAlumni = await alumni.save();
        // ✅ Securely Process Image Upload
        if (req.file) {

            const allowedMimeTypes = ["image/jpeg", "image/png"];
            const fileType = await FileType.fromBuffer(req.file.buffer);

            if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
                return res.status(400).json({ message: "Invalid file type. Only JPEG and PNG are allowed." });
            }

            const fileContent = req.file.buffer.toString('utf-8').toLowerCase();
            if (dangerousPatterns.some(pattern => fileContent.includes(pattern))) {
                await Alumni.findByIdAndDelete(savedAlumni._id);
                return res.status(500).json({ success: false, message: 'Failed to save the image' });
            }

            const uploadDir = path.join(__dirname, '../uploads/images');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileExtension = fileType.ext;
            const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;
            const filePath = path.join(uploadDir, uniqueFilename);
            const fileBuffer = req.file.buffer;

            fs.writeFile(filePath, fileBuffer, async (err) => {
                if (err) {
                    await Alumni.findByIdAndDelete(savedAlumni._id);
                    return res.status(500).json({ success: false, message: 'Failed to save the image' });
                }

                savedAlumni.profilePictureInfo.image = uniqueFilename;
                await savedAlumni.save();

                return res.status(201).json({
                    success: true,
                    message: 'Alumni Form Submission successful',
                    data: savedAlumni,
                });
            });
        } else {
            await Alumni.findByIdAndDelete(savedAlumni._id);
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
        if (status === '1') emailService.sendAlumniConfirmationMail(alumni.contactInfo.email, "Registration Confirmation", alumni)
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