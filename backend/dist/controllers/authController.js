"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendResetOTP = exports.resetPassword = exports.verifyResetOTP = exports.forgotPassword = exports.verifyToken = exports.userLogout = exports.userLogin = exports.userSignup = exports.resendSignupOTP = exports.verifySignupOTP = exports.sendSignupOTP = exports.adminLogout = exports.adminLogin = exports.createAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Admin_1 = __importDefault(require("../models/Admin"));
const User_1 = __importDefault(require("../models/User"));
const OTP_1 = __importDefault(require("../models/OTP"));
const PasswordReset_1 = __importDefault(require("../models/PasswordReset"));
const email_1 = require("../utils/email");
// Ensure environment variables are loaded
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start without it.');
}
// POST /api/admin/create
const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingAdmin = await Admin_1.default.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const admin = await Admin_1.default.create({
            username,
            password: hashedPassword,
            isSuperAdmin: true,
        });
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: { username: admin.username }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create admin' });
    }
};
exports.createAdmin = createAdmin;
// POST /api/auth/admin/login
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin_1.default.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValid = await bcryptjs_1.default.compare(password, admin.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id, username: admin.username, type: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        // Set cookie for cross-domain
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 * 1000 // 7 days in ms
        });
        res.json({
            success: true,
            admin: { id: admin._id, username: admin.username },
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.adminLogin = adminLogin;
// POST /api/auth/admin/logout
const adminLogout = async (req, res) => {
    res.clearCookie('adminToken');
    res.json({ success: true });
};
exports.adminLogout = adminLogout;
// POST /api/auth/user/send-otp - Send OTP for email verification
const sendSignupOTP = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        // Generate OTP
        const otp = (0, email_1.generateOTP)();
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Delete any existing OTP for this email
        await OTP_1.default.deleteMany({ email });
        // Save OTP with user details (expires in 10 minutes)
        await OTP_1.default.create({
            email,
            otp,
            firstName,
            lastName,
            password: hashedPassword,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });
        // Send OTP email
        const emailHtml = (0, email_1.getOTPEmailTemplate)(otp, firstName);
        const emailSent = await (0, email_1.sendEmail)({
            to: email,
            subject: 'Verify Your Email - EZ Masala',
            html: emailHtml
        });
        if (!emailSent) {
            return res.status(500).json({ error: 'Failed to send OTP email. Please try again.' });
        }
        res.json({
            success: true,
            message: 'OTP sent successfully to your email'
        });
    }
    catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to send OTP' });
    }
};
exports.sendSignupOTP = sendSignupOTP;
// POST /api/auth/user/verify-otp - Verify OTP and create user
const verifySignupOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }
        // Find OTP record
        const otpRecord = await OTP_1.default.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            await OTP_1.default.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }
        // Create user with stored details
        const user = await User_1.default.create({
            firstName: otpRecord.firstName,
            lastName: otpRecord.lastName,
            email: otpRecord.email,
            password: otpRecord.password, // Already hashed
        });
        // Delete OTP record
        await OTP_1.default.deleteOne({ _id: otpRecord._id });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, type: 'user' }, JWT_SECRET, { expiresIn: '7d' });
        // Set cookie for cross-domain
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 * 1000 // 7 days in ms
        });
        res.status(201).json({
            success: true,
            user: {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            token,
        });
    }
    catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to verify OTP' });
    }
};
exports.verifySignupOTP = verifySignupOTP;
// POST /api/auth/user/resend-otp - Resend OTP
const resendSignupOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        // Find existing OTP record
        const existingOTP = await OTP_1.default.findOne({ email });
        if (!existingOTP) {
            return res.status(400).json({ error: 'No pending verification found. Please sign up again.' });
        }
        // Generate new OTP
        const otp = (0, email_1.generateOTP)();
        // Update OTP record
        existingOTP.otp = otp;
        existingOTP.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await existingOTP.save();
        // Send OTP email
        const emailHtml = (0, email_1.getOTPEmailTemplate)(otp, existingOTP.firstName);
        const emailSent = await (0, email_1.sendEmail)({
            to: email,
            subject: 'Verify Your Email - EZ Masala',
            html: emailHtml
        });
        if (!emailSent) {
            return res.status(500).json({ error: 'Failed to send OTP email. Please try again.' });
        }
        res.json({
            success: true,
            message: 'OTP resent successfully'
        });
    }
    catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to resend OTP' });
    }
};
exports.resendSignupOTP = resendSignupOTP;
// POST /api/auth/user/signup - Legacy signup (kept for backwards compatibility, but recommends OTP)
const userSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, type: 'user' }, JWT_SECRET, { expiresIn: '7d' });
        // Set cookie for cross-domain
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 * 1000 // 7 days in ms
        });
        res.status(201).json({
            user: {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            token,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.userSignup = userSignup;
// POST /api/auth/user/login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, type: 'user' }, JWT_SECRET, { expiresIn: '7d' });
        // Set cookie for cross-domain
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 * 1000 // 7 days in ms
        });
        res.json({
            user: {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            token,
        });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};
exports.userLogin = userLogin;
// POST /api/auth/user/logout
const userLogout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};
exports.userLogout = userLogout;
// Utility function to verify token
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;
// POST /api/auth/user/forgot-password - Send OTP for password reset
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        // Check if user exists
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'No account found with this email' });
        }
        // Generate OTP
        const otp = (0, email_1.generateOTP)();
        // Delete any existing password reset OTP for this email
        await PasswordReset_1.default.deleteMany({ email });
        // Save OTP (expires in 10 minutes)
        await PasswordReset_1.default.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });
        // Send OTP email
        const userName = `${user.firstName} ${user.lastName}`.trim() || 'User';
        const emailHtml = (0, email_1.getPasswordResetOTPTemplate)(otp, userName);
        const emailSent = await (0, email_1.sendEmail)({
            to: email,
            subject: 'Reset Your Password - EZ Masala',
            html: emailHtml
        });
        if (!emailSent) {
            return res.status(500).json({ error: 'Failed to send OTP email. Please try again.' });
        }
        res.json({
            success: true,
            message: 'OTP sent to your email'
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: error.message || 'Failed to process request' });
    }
};
exports.forgotPassword = forgotPassword;
// POST /api/auth/user/verify-reset-otp - Verify OTP for password reset
const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }
        // Find OTP record
        const otpRecord = await PasswordReset_1.default.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            await PasswordReset_1.default.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }
        res.json({
            success: true,
            message: 'OTP verified successfully'
        });
    }
    catch (error) {
        console.error('Verify reset OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to verify OTP' });
    }
};
exports.verifyResetOTP = verifyResetOTP;
// POST /api/auth/user/reset-password - Reset password after OTP verification
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: 'Email, OTP, and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        // Verify OTP again
        const otpRecord = await PasswordReset_1.default.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        if (new Date() > otpRecord.expiresAt) {
            await PasswordReset_1.default.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }
        // Find user and update password
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Hash new password and update
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        // Delete OTP record
        await PasswordReset_1.default.deleteOne({ _id: otpRecord._id });
        res.json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: error.message || 'Failed to reset password' });
    }
};
exports.resetPassword = resetPassword;
// POST /api/auth/user/resend-reset-otp - Resend OTP for password reset
const resendResetOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        // Check if user exists
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'No account found with this email' });
        }
        // Generate new OTP
        const otp = (0, email_1.generateOTP)();
        // Delete any existing password reset OTP and create new one
        await PasswordReset_1.default.deleteMany({ email });
        await PasswordReset_1.default.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });
        // Send OTP email
        const userName = `${user.firstName} ${user.lastName}`.trim() || 'User';
        const emailHtml = (0, email_1.getPasswordResetOTPTemplate)(otp, userName);
        const emailSent = await (0, email_1.sendEmail)({
            to: email,
            subject: 'Reset Your Password - EZ Masala',
            html: emailHtml
        });
        if (!emailSent) {
            return res.status(500).json({ error: 'Failed to send OTP email. Please try again.' });
        }
        res.json({
            success: true,
            message: 'OTP resent successfully'
        });
    }
    catch (error) {
        console.error('Resend reset OTP error:', error);
        res.status(500).json({ error: error.message || 'Failed to resend OTP' });
    }
};
exports.resendResetOTP = resendResetOTP;
//# sourceMappingURL=authController.js.map