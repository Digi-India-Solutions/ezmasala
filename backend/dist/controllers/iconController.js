"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIcon = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const Icon_1 = __importDefault(require("../models/Icon"));
// GET /api/icons
const getAll = async (req, res) => {
    try {
        const icons = await Icon_1.default.find().sort({ createdAt: 1 }).lean();
        res.json(icons);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAll = getAll;
// GET /api/icons/:id
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const icon = await Icon_1.default.findById(id).lean();
        if (!icon) {
            return res.status(404).json({ error: 'Icon not found' });
        }
        res.json(icon);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getById = getById;
// POST /api/icons
const create = async (req, res) => {
    try {
        const icon = await Icon_1.default.create(req.body);
        res.status(201).json(icon);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
// PUT /api/icons/:id
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const icon = await Icon_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!icon) {
            return res.status(404).json({ error: 'Icon not found' });
        }
        res.json(icon);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.update = update;
// DELETE /api/icons/:id
const deleteIcon = async (req, res) => {
    try {
        const { id } = req.params;
        const icon = await Icon_1.default.findByIdAndDelete(id);
        if (!icon) {
            return res.status(404).json({ error: 'Icon not found' });
        }
        res.json(icon);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteIcon = deleteIcon;
//# sourceMappingURL=iconController.js.map