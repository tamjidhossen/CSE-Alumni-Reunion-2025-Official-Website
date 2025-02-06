const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    link: { type: String, default: "" },
}, { timestamps: true });

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
