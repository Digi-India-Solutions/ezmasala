"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.update = exports.create = exports.getBySlug = exports.getById = exports.getAll = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const cloudinary_1 = require("../config/cloudinary");
// Helper function to generate slug
const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};
// GET /api/blogs
const getAll = async (req, res) => {
    try {
        const blogs = await Blog_1.default.find().sort({ createdAt: -1 }).lean();
        res.json(blogs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAll = getAll;
// GET /api/blogs/:id
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog_1.default.findById(id).lean();
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getById = getById;
// GET /api/blogs/slug/:slug
const getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await Blog_1.default.findOne({ slug }).lean();
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getBySlug = getBySlug;
// POST /api/blogs
const create = async (req, res) => {
    try {
        const body = req.body;
        let imageUrl = body.image;
        if (body.image && body.image.startsWith('data:')) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(body.image, 'blogs');
        }
        const slug = generateSlug(body.title);
        const blog = await Blog_1.default.create({ ...body, image: imageUrl, slug });
        res.status(201).json(blog);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
// PUT /api/blogs/:id
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        let imageUrl = body.image;
        if (body.image && body.image.startsWith('data:')) {
            imageUrl = await (0, cloudinary_1.uploadToCloudinary)(body.image, 'blogs');
        }
        const updateData = { ...body, image: imageUrl };
        if (body.title) {
            updateData.slug = generateSlug(body.title);
        }
        const blog = await Blog_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.update = update;
// DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog_1.default.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteBlog = deleteBlog;
//# sourceMappingURL=blogController.js.map