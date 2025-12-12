"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.update = exports.create = exports.getAll = void 0;
const Banner_1 = __importDefault(require("../models/Banner"));
const cloudinary_1 = require("../config/cloudinary");
// GET /api/banners
// Query params: ?all=true to get all banners (for admin), default returns only active banners
const getAll = async (req, res) => {
    try {
        const { all } = req.query;
        // If all=true, return all banners (for admin panel)
        // Otherwise, return only active banners (for frontend)
        const query = all === 'true' ? {} : { isActive: true };
        const banners = await Banner_1.default.find(query)
            .sort({ priority: -1, createdAt: -1 })
            .lean();
        res.json({ banners });
    }
    catch (error) {
        console.error('Failed to fetch banners:', error);
        res.status(500).json({
            error: 'Failed to fetch banners',
            details: error.message
        });
    }
};
exports.getAll = getAll;
// POST /api/banners
const create = async (req, res) => {
    try {
        const body = req.body;
        if (!body.image) {
            return res.status(400).json({ error: 'Image is required' });
        }
        let imageUrl = body.image;
        // Upload to Cloudinary if base64
        if (body.image && body.image.startsWith('data:')) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(body.image, 'banners');
        }
        const banner = await Banner_1.default.create({
            image: imageUrl,
            priority: body.priority || 0,
            isActive: body.isActive !== undefined ? body.isActive : true,
        });
        res.status(201).json({ banner });
    }
    catch (error) {
        console.error('Failed to create banner:', error);
        res.status(500).json({
            error: 'Failed to create banner',
            details: error.message
        });
    }
};
exports.create = create;
// PUT /api/banners/:id
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const banner = await Banner_1.default.findByIdAndUpdate(id, {
            priority: body.priority,
            isActive: body.isActive
        }, { new: true });
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        res.json({ banner });
    }
    catch (error) {
        console.error('Failed to update banner:', error);
        res.status(500).json({
            error: 'Failed to update banner',
            details: error.message
        });
    }
};
exports.update = update;
// DELETE /api/banners/:id
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner_1.default.findByIdAndDelete(id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Failed to delete banner:', error);
        res.status(500).json({
            error: 'Failed to delete banner',
            details: error.message
        });
    }
};
exports.deleteBanner = deleteBanner;
//# sourceMappingURL=bannerController.js.map