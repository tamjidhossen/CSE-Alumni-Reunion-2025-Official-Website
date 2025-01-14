const Announcement = require('../models/announcement.model.js');

const createAnnouncement = async (req, res) => {
    try {
        const { title, description, link } = req.body;
        if (!title || !description || !link) {
            return res.status(400).json({ success: false, message: 'All fields (title, description, link) are required' });
        }
        const count = await Announcement.countDocuments();
        const announcement = new Announcement({
            id: count + 1,
            title,
            description,
            link,
        });
        await announcement.save();
        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            announcement,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while creating the announcement' });
    }
};

// Get all announcements
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ date: -1 }); // Sort by date, newest first
        res.status(200).json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching announcements' });
    }
};

// Get a single announcement by ID
const getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findOne({ id });

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the announcement' });
    }
};

// Update an announcement by ID
const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, link } = req.body;

        // Find and update the announcement
        const updatedAnnouncement = await Announcement.findOneAndUpdate(
            { id },
            { title, description, link, date: Date.now() }, // Update date to current time
            { new: true }
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({
            message: 'Announcement updated successfully',
            updatedAnnouncement,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the announcement' });
    }
};

// Delete an announcement by ID
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAnnouncement = await Announcement.findOneAndDelete({ id });

        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the announcement' });
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
};
