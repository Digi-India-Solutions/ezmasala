import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../models/Admin';
import User from '../models/User';
import OTP from '../models/OTP';
import PasswordReset from '../models/PasswordReset';
import { sendEmail, generateOTP, getOTPEmailTemplate, getPasswordResetOTPTemplate } from '../utils/email';

// Ensure environment variables are loaded
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start without it.');
}

// POST /api/admin/create
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      username,
      password: hashedPassword,
      isSuperAdmin: true,
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: { username: admin.username }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create admin' });
  }
};

// POST /api/auth/admin/login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, type: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie for cross-domain
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: isProduction ? '.ezmasalaa.com' : undefined,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 * 1000 // 7 days in ms
    });

    res.json({
      success: true,
      admin: { id: admin._id, username: admin.username },
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// POST /api/auth/admin/logout
export const adminLogout = async (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    domain: isProduction ? '.ezmasalaa.com' : undefined,
    path: '/',
  });
  res.json({ success: true });
};

// POST /api/auth/user/send-otp - Send OTP for email verification
export const sendSignupOTP = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save OTP with user details (expires in 10 minutes)
    await OTP.create({
      email,
      otp,
      firstName,
      lastName,
      password: hashedPassword,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    const emailHtml = getOTPEmailTemplate(otp, firstName);
    const emailSent = await sendEmail({
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
  } catch (error: any) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: error.message || 'Failed to send OTP' });
  }
};

// POST /api/auth/user/verify-otp - Verify OTP and create user
export const verifySignupOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Create user with stored details
    const user = await User.create({
      firstName: otpRecord.firstName,
      lastName: otpRecord.lastName,
      email: otpRecord.email,
      password: otpRecord.password, // Already hashed
    });

    // Delete OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, type: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie for cross-domain
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: isProduction ? '.ezmasalaa.com' : undefined,
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
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: error.message || 'Failed to verify OTP' });
  }
};

// POST /api/auth/user/resend-otp - Resend OTP
export const resendSignupOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find existing OTP record
    const existingOTP = await OTP.findOne({ email });
    if (!existingOTP) {
      return res.status(400).json({ error: 'No pending verification found. Please sign up again.' });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Update OTP record
    existingOTP.otp = otp;
    existingOTP.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await existingOTP.save();

    // Send OTP email
    const emailHtml = getOTPEmailTemplate(otp, existingOTP.firstName);
    const emailSent = await sendEmail({
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
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: error.message || 'Failed to resend OTP' });
  }
};

// POST /api/auth/user/signup - Legacy signup (kept for backwards compatibility, but recommends OTP)
export const userSignup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, type: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie for cross-domain
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: isProduction ? '.ezmasalaa.com' : undefined,
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
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// POST /api/auth/user/login
export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, type: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie for cross-domain
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: isProduction ? '.ezmasalaa.com' : undefined,
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
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

// POST /api/auth/user/logout
export const userLogout = async (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    domain: isProduction ? '.ezmasalaa.com' : undefined,
    path: '/',
  });
  res.json({ message: 'Logged out successfully' });
};

// Utility function to verify token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// POST /api/auth/user/forgot-password - Send OTP for password reset
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing password reset OTP for this email
    await PasswordReset.deleteMany({ email });

    // Save OTP (expires in 10 minutes)
    await PasswordReset.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    const userName = `${user.firstName} ${user.lastName}`.trim() || 'User';
    const emailHtml = getPasswordResetOTPTemplate(otp, userName);
    const emailSent = await sendEmail({
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
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: error.message || 'Failed to process request' });
  }
};

// POST /api/auth/user/verify-reset-otp - Verify OTP for password reset
export const verifyResetOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Find OTP record
    const otpRecord = await PasswordReset.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await PasswordReset.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error: any) {
    console.error('Verify reset OTP error:', error);
    res.status(500).json({ error: error.message || 'Failed to verify OTP' });
  }
};

// POST /api/auth/user/reset-password - Reset password after OTP verification
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Verify OTP again
    const otpRecord = await PasswordReset.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date() > otpRecord.expiresAt) {
      await PasswordReset.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP record
    await PasswordReset.deleteOne({ _id: otpRecord._id });

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: error.message || 'Failed to reset password' });
  }
};

// POST /api/auth/user/resend-reset-otp - Resend OTP for password reset
export const resendResetOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Delete any existing password reset OTP and create new one
    await PasswordReset.deleteMany({ email });
    await PasswordReset.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP email
    const userName = `${user.firstName} ${user.lastName}`.trim() || 'User';
    const emailHtml = getPasswordResetOTPTemplate(otp, userName);
    const emailSent = await sendEmail({
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
  } catch (error: any) {
    console.error('Resend reset OTP error:', error);
    res.status(500).json({ error: error.message || 'Failed to resend OTP' });
  }
};
