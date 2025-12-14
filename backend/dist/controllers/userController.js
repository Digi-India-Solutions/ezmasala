"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.updateAddresses = exports.addAddress = exports.getById = exports.getAll = void 0;
const User_1 = __importDefault(require("../models/User"));
const email_1 = require("../utils/email");
// GET /api/users
const getAll = async (req, res) => {
    try {
        const users = await User_1.default.find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getAll = getAll;
// GET /api/user/:id
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findById(id).select('-password').lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getById = getById;
// POST /api/user/:id/addresses
const addAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = req.body;
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // If new address is default, unset others
        if (address.isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }
        user.addresses.push(address);
        await user.save();
        res.status(201).json(user.addresses);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addAddress = addAddress;
// PUT /api/user/:id/addresses
const updateAddresses = async (req, res) => {
    try {
        const { id } = req.params;
        const { addresses } = req.body;
        const user = await User_1.default.findByIdAndUpdate(id, { addresses }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateAddresses = updateAddresses;
// PUT /api/user/:id/profile
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email } = req.body;
        // Verify the user making the request is the owner or admin
        if (req.user?.id !== id && req.user?.type !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to update this profile' });
        }
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Track changes for email notification
        const changes = [];
        const oldEmail = user.email;
        // Update fields and track changes
        if (firstName && firstName !== user.firstName) {
            changes.push(`First Name updated to: ${firstName}`);
            user.firstName = firstName;
        }
        if (lastName && lastName !== user.lastName) {
            changes.push(`Last Name updated to: ${lastName}`);
            user.lastName = lastName;
        }
        if (email && email !== user.email) {
            // Check if new email already exists
            const existingUser = await User_1.default.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            changes.push(`Email updated to: ${email}`);
            user.email = email;
        }
        // Save user
        await user.save();
        // Send confirmation email to both old and new email if email was changed
        if (changes.length > 0) {
            const userName = `${user.firstName} ${user.lastName}`;
            const emailHtml = (0, email_1.getProfileUpdateConfirmationTemplate)(userName, changes);
            // Send to new email
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: 'Profile Updated - EZ Masala',
                html: emailHtml,
            });
            // If email changed, notify the old email as well
            if (email && email !== oldEmail) {
                await (0, email_1.sendEmail)({
                    to: oldEmail,
                    subject: 'Profile Email Changed - EZ Masala',
                    html: emailHtml,
                });
            }
        }
        // Return updated user without password
        const updatedUser = await User_1.default.findById(id).select('-password');
        res.json({
            success: true,
            user: updatedUser,
            message: 'Profile updated successfully. Confirmation email sent.'
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=userController.js.map