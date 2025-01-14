const Student = require('../models/student.model.js');

const addStudent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }
        const jsonDataString = req.body.jsonData;
        const data = JSON.parse(jsonDataString);
        const existingStudent = await Student.findOne({ 'paymentInfo.transactionId': data.paymentInfo.transactionId });
        data.paymentInfo.totalAmount = process.env.ADULT_FEE;
        data.paymentInfo.status = 0;
        if (existingStudent) {
            return res.status(400).json({ success: false, message: 'Transaction ID already exists' });
        }
        data.profilePictureInfo.image = req.file.filename;

        const student = new Student({
            personalInfo: data.personalInfo,
            contactInfo: data.contactInfo,
            paymentInfo: data.paymentInfo,
            profilePictureInfo: data.profilePictureInfo
        });

        await student.save();

        res.status(201).json({
            success: true,
            data: student,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { addStudent };
