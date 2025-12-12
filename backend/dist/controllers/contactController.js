"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.create = exports.getById = exports.getAll = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const email_1 = require("../utils/email");
// GET /api/contacts
const getAll = async (req, res) => {
    try {
        const contacts = await Contact_1.default.find().sort({ createdAt: -1 }).lean();
        res.json(contacts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAll = getAll;
// GET /api/contacts/:id
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact_1.default.findById(id).lean();
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getById = getById;
// POST /api/contacts
const create = async (req, res) => {
    try {
        const { name, email, mobile, city, queryType, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }
        const contact = await Contact_1.default.create({ name, email, mobile, city, queryType, message });
        // Send email notification to website admin
        const notificationEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_FROM_EMAIL;
        if (notificationEmail) {
            const isBulkEnquiry = queryType === 'bulk';
            const emailSubject = isBulkEnquiry
                ? `New Bulk Enquiry from ${name} - EZ Masala`
                : `New Contact Form Submission from ${name} - EZ Masala`;
            const emailHtml = (0, email_1.getContactFormEmailTemplate)({
                name,
                email,
                mobile,
                city,
                queryType,
                message
            });
            // Send email asynchronously (don't wait for it to complete)
            (0, email_1.sendEmail)({
                to: notificationEmail,
                subject: emailSubject,
                html: emailHtml
            }).catch(err => console.error('Failed to send contact notification email:', err));
        }
        res.status(201).json({ success: true, contact });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
// DELETE /api/contacts/:id
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact_1.default.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteContact = deleteContact;
//# sourceMappingURL=contactController.js.map