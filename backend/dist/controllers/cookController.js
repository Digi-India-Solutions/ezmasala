"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCook = exports.update = exports.create = exports.getBySlug = exports.getAll = void 0;
const Cook_1 = __importDefault(require("../models/Cook"));
const cloudinary_1 = require("../config/cloudinary");
// Helper function to generate slug
const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};
// GET /api/cooks
const getAll = async (req, res) => {
    try {
        const cooks = await Cook_1.default.find().sort({ createdAt: -1 }).lean();
        res.json(cooks);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAll = getAll;
// GET /api/cooks/slug/:slug
const getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const cook = await Cook_1.default.findOne({ slug }).lean();
        if (!cook) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(cook);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getBySlug = getBySlug;
// POST /api/cooks
const create = async (req, res) => {
    try {
        const body = req.body;
        let imageUrl = body.image;
        if (body.image && body.image.startsWith('data:')) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(body.image, 'cooks');
        }
        const slug = generateSlug(body.title);
        const cook = await Cook_1.default.create({ ...body, image: imageUrl, slug });
        res.status(201).json(cook);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
// PUT /api/cooks/:id
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        let imageUrl = body.image;
        if (body.image && body.image.startsWith('data:')) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(body.image, 'cooks');
        }
        const updateData = { ...body, image: imageUrl };
        if (body.title) {
            updateData.slug = generateSlug(body.title);
        }
        const cook = await Cook_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!cook) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(cook);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.update = update;
// DELETE /api/cooks/:id
const deleteCook = async (req, res) => {
    try {
        const { id } = req.params;
        const cook = await Cook_1.default.findByIdAndDelete(id);
        if (!cook) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteCook = deleteCook;
//# sourceMappingURL=cookController.js.map