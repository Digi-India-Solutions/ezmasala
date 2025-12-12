"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const Spice_1 = __importDefault(require("../models/Spice"));
// GET /api/search
const search = async (req, res) => {
    try {
        const query = req.query.q || '';
        if (!query.trim()) {
            return res.json([]);
        }
        const spices = await Spice_1.default.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        })
            .select('_id title price image category ratings')
            .limit(10)
            .lean();
        res.json(spices);
    }
    catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};
exports.search = search;
//# sourceMappingURL=searchController.js.map