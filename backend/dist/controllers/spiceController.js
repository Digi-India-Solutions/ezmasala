"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewFeatured = exports.addReview = exports.deleteSpice = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const Spice_1 = __importDefault(require("../models/Spice"));
const cloudinary_1 = require("../config/cloudinary");
// GET /api/spices
const getAll = async (req, res) => {
    try {
        const { category, type } = req.query;
        // Handle bestsellers
        if (type === 'bestsellers') {
            const spices = await Spice_1.default.find()
                .sort({ ratings: -1 })
                .limit(8)
                .lean();
            return res.json(spices);
        }
        // Handle category filter
        let filter = {};
        if (category) {
            const categories = Array.isArray(category) ? category : [category];
            filter.category = { $in: categories };
        }
        const spices = await Spice_1.default.find(filter)
            .sort({ createdAt: -1 })
            .lean();
        res.json(spices);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAll = getAll;
// GET /api/spices/:id
const getById = async (req, res) => {
    try {
        const spice = await Spice_1.default.findById(req.params.id).lean();
        if (!spice) {
            return res.status(404).json({ error: 'Spice not found' });
        }
        res.json(spice);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getById = getById;
// POST /api/spices
const create = async (req, res) => {
    try {
        const body = req.body;
        let imageUrl = body.image;
        // Upload image to Cloudinary if base64
        if (body.image && body.image.startsWith('data:')) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(body.image, 'spices');
        }
        const spice = await Spice_1.default.create({
            ratings: 0,
            images: [],
            icons: [],
            ...body,
            image: imageUrl,
        });
        res.status(201).json(spice);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
// PUT /api/spices/:id
const update = async (req, res) => {
    try {
        const body = req.body;
        let imageUrl = body.image;
        // Upload image to Cloudinary if base64
        if (body.image && body.image.startsWith('data:')) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(body.image, 'spices');
        }
        const spice = await Spice_1.default.findByIdAndUpdate(req.params.id, { ...body, image: imageUrl }, { new: true });
        if (!spice) {
            return res.status(404).json({ error: 'Spice not found' });
        }
        res.json(spice);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.update = update;
// DELETE /api/spices/:id
const deleteSpice = async (req, res) => {
    try {
        const spice = await Spice_1.default.findByIdAndDelete(req.params.id);
        if (!spice) {
            return res.status(404).json({ error: 'Spice not found' });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteSpice = deleteSpice;
// POST /api/spices/:id/reviews
const addReview = async (req, res) => {
    try {
        const { userId, userName, rating, text } = req.body;
        if (!userId || !userName || !rating || !text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const spice = await Spice_1.default.findById(req.params.id);
        if (!spice) {
            return res.status(404).json({ error: 'Spice not found' });
        }
        spice.reviews.push({
            userId,
            userName,
            rating,
            text,
            featured: false,
            createdAt: new Date(),
        });
        // Update average rating
        const totalRating = spice.reviews.reduce((sum, r) => sum + r.rating, 0);
        spice.ratings = totalRating / spice.reviews.length;
        await spice.save();
        res.json(spice);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add review' });
    }
};
exports.addReview = addReview;
// PUT /api/reviews/:spiceId/:reviewIndex
const updateReviewFeatured = async (req, res) => {
    try {
        const { spiceId, reviewIndex } = req.params;
        const { featured } = req.body;
        const index = parseInt(reviewIndex);
        const spice = await Spice_1.default.findById(spiceId);
        if (!spice || !spice.reviews[index]) {
            return res.status(404).json({ error: 'Review not found' });
        }
        spice.reviews[index].featured = featured;
        await spice.save();
        res.json({ spice });
    }
    catch (error) {
        console.error('Failed to update review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
};
exports.updateReviewFeatured = updateReviewFeatured;
//# sourceMappingURL=spiceController.js.map