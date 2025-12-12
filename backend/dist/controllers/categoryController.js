"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = void 0;
const Spice_1 = __importDefault(require("../models/Spice"));
// GET /api/categories
const getAll = async (req, res) => {
    try {
        // Get all unique categories from spices
        const categories = await Spice_1.default.distinct('category');
        // Flatten the array since category is an array field and return unique values
        const uniqueCategories = [...new Set(categories.flat())].filter(Boolean);
        // Format categories with additional info
        const formattedCategories = uniqueCategories.map((cat, index) => ({
            id: String(index + 1),
            name: cat.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            slug: cat,
        }));
        res.json({ categories: formattedCategories });
    }
    catch (error) {
        console.error('Failed to fetch categories:', error);
        res.status(500).json({
            error: 'Failed to fetch categories',
            details: error.message
        });
    }
};
exports.getAll = getAll;
//# sourceMappingURL=categoryController.js.map