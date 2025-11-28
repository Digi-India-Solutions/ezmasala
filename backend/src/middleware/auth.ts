import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    username?: string;
    type: 'user' | 'admin';
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for token - prioritize adminToken and Authorization header over user token
    const token =
      req.cookies.adminToken ||
      req.headers.authorization?.split(' ')[1] ||
      req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      username: decoded.username,
      type: decoded.type || 'user',
    };
    next();
  } catch (error: any) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies.token ||
      req.cookies.adminToken ||
      req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = {
        id: decoded.id || decoded.userId,
        email: decoded.email,
        username: decoded.username,
        type: decoded.type || 'user',
      };
    }
  } catch (error) {
    // Silently continue without auth
  }
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const requireUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};
