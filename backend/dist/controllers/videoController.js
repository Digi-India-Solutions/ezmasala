"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const Video_1 = __importDefault(require("../models/Video"));
// GET /api/videos
const getAll = async (req, res) => {
    try {
        const videos = await Video_1.default.find()
            .populate('spiceId')
            .sort({ createdAt: -1 })
            .lean();
        res.json(videos);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAll = getAll;
// GET /api/videos/:id
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video_1.default.findById(id).populate('spiceId').lean();
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.json(video);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getById = getById;
// POST /api/videos
const create = async (req, res) => {
    try {
        const { spiceId, videoUrl, posterUrl } = req.body;
        const video = await Video_1.default.create({ spiceId, videoUrl, posterUrl });
        res.status(201).json(video);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
// PUT /api/videos/:id
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.json(video);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.update = update;
// DELETE /api/videos/:id
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video_1.default.findByIdAndDelete(id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteVideo = deleteVideo;
//# sourceMappingURL=videoController.js.map