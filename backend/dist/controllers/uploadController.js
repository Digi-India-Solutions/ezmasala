"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipart = exports.upload = void 0;
const cloudinary_1 = require("../config/cloudinary");
// POST /api/upload
const upload = async (req, res) => {
    try {
        const { file, folder = 'general' } = req.body;
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        // Handle base64 file upload
        const imageUrl = await (0, cloudinary_1.uploadToCloudinary)(file, folder);
        res.json({ url: imageUrl });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.upload = upload;
// Alternative handler for multipart form data
const uploadMultipart = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        const folder = req.body.folder || 'general';
        // Convert buffer to base64
        const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const imageUrl = await (0, cloudinary_1.uploadToCloudinary)(base64, folder);
        res.json({ url: imageUrl });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Upload failed' });
    }
};
exports.uploadMultipart = uploadMultipart;
//# sourceMappingURL=uploadController.js.map