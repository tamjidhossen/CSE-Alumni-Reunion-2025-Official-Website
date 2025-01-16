const Student = require('../models/student.model.js');
const Alumni = require('../models/alumni.model.js');

const paymentCheck = async (req, res) => {
    const { roll, reg, transactionId } = req.params;

    try {
        // Check in Student model
        const student = await Student.findOne({
            'personalInfo.roll': roll,
            'personalInfo.registrationNo': reg,
            'paymentInfo.transactionId': transactionId,
        });

        if (student) {
            let statusMessage = getStatusMessage(student.paymentInfo.status);
            return res.status(200).json({
                success: true,
                message: 'Payment status fetched successfully from Student model',
                model: 'Student',
                paymentStatus: student.paymentInfo.status,
                statusMessage,
            });
        }

        // Check in Alumni model
        const alumni = await Alumni.findOne({
            'personalInfo.roll': roll,
            'personalInfo.registrationNo': reg,
            'paymentInfo.transactionId': transactionId,
        });

        if (alumni) {
            let statusMessage = getStatusMessage(alumni.paymentInfo.status);
            return res.status(200).json({
                success: true,
                message: 'Payment status fetched successfully from Alumni model',
                model: 'Alumni',
                paymentStatus: alumni.paymentInfo.status,
                statusMessage,
            });
        }

        // If neither found
        return res.status(404).json({
            success: false,
            message: 'No record found for the provided roll, registration number, and transaction ID',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payment status',
            error: error.message,
        });
    }
};

// Utility function to get status message
const getStatusMessage = (status) => {
    switch (status) {
        case 0:
            return 'Pending';
        case 1:
            return 'Paid';
        case 2:
            return 'Rejected';
        default:
            return 'Unknown status';
    }
};

const paymentUpdate = async (req, res) => {
    const { transactionId, status } = req.params;

    try {
        // Validate status parameter
        const validStatuses = [0, 1, 2];
        if (!validStatuses.includes(Number(status))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Valid statuses are 0 (Pending), 1 (Paid), 2 (Rejected).',
            });
        }

        // Search and update in Student model
        const student = await Student.findOneAndUpdate(
            { 'paymentInfo.transactionId': transactionId },
            { 'paymentInfo.status': status },
            { new: true }
        );

        if (student) {
            return res.status(200).json({
                success: true,
                message: 'Payment status updated successfully in Student model',
                model: 'Student',
                updatedRecord: student,
            });
        }

        // Search and update in Alumni model
        const alumni = await Alumni.findOneAndUpdate(
            { 'paymentInfo.transactionId': transactionId },
            { 'paymentInfo.status': status },
            { new: true }
        );

        if (alumni) {
            return res.status(200).json({
                success: true,
                message: 'Payment status updated successfully in Alumni model',
                model: 'Alumni',
                updatedRecord: alumni,
            });
        }

        // If no record found in both models
        return res.status(404).json({
            success: false,
            message: 'No record found for the provided transaction ID',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating payment status',
            error: error.message,
        });
    }
};

module.exports = { paymentCheck, paymentUpdate };
