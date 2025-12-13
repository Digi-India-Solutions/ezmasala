"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = exports.requireAdmin = exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Ensure environment variables are loaded
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start without it.');
}
const authenticate = (req, res, next) => {
    try {
        // Check for token - prioritize adminToken and Authorization header over user token
        const token = req.cookies.adminToken ||
            req.headers.authorization?.split(' ')[1] ||
            req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id || decoded.userId,
            email: decoded.email,
            username: decoded.username,
            type: decoded.type || 'user',
        };
        next();
    }
    catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
const optionalAuth = (req, res, next) => {
    try {
        const token = req.cookies.token ||
            req.cookies.adminToken ||
            req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.user = {
                id: decoded.id || decoded.userId,
                email: decoded.email,
                username: decoded.username,
                type: decoded.type || 'user',
            };
        }
    }
    catch (error) {
        // Silently continue without auth
    }
    next();
};
exports.optionalAuth = optionalAuth;
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.type !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};
exports.requireUser = requireUser;
//# sourceMappingURL=auth.js.map