const Admin = require('../models/admin.model.js');
const Alumni = require('../models/alumni.model.js');
// Register Admin
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
        }

        // Create a new admin instance
        const admin = new Admin({
            name,
            email,
            password,
        });

        // Save the admin to the database
        await admin.save();

        // Generate a token
        const token = admin.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while registering the admin' });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Check if the admin exists
        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate a token
        const token = admin.generateAuthToken();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while logging in the admin' });
    }
};

module.exports = {
    registerAdmin,
    loginAdmin
};
