"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeal = exports.update = exports.create = exports.getAll = void 0;
const Deal_1 = __importDefault(require("../models/Deal"));
// GET /api/deals
const getAll = async (req, res) => {
    try {
        const deals = await Deal_1.default.find({ isActive: true })
            .sort({ priority: -1, createdAt: -1 })
            .lean();
        res.json({ deals });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAll = getAll;
// POST /api/deals
const create = async (req, res) => {
    try {
        const { title, priority, isActive } = req.body;
        const deal = await Deal_1.default.create({
            title,
            priority: priority || 0,
            isActive: isActive !== undefined ? isActive : true,
        });
        res.status(201).json({ deal });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = create;
// PUT /api/deals/:id
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, priority, isActive } = req.body;
        const deal = await Deal_1.default.findByIdAndUpdate(id, { title, priority, isActive }, { new: true });
        if (!deal) {
            return res.status(404).json({ error: 'Deal not found' });
        }
        res.json({ deal });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.update = update;
// DELETE /api/deals/:id
const deleteDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const deal = await Deal_1.default.findByIdAndDelete(id);
        if (!deal) {
            return res.status(404).json({ error: 'Deal not found' });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteDeal = deleteDeal;
//# sourceMappingURL=dealController.js.map