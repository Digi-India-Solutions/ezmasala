import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../models/Admin';
import User from '../models/User';

// Ensure environment variables are loaded
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
  res.clearCookie('adminToken');
  res.json({ success: true });
};

// POST /api/auth/user/signup
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
  res.clearCookie('token');
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
