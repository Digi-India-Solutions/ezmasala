"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearWishlist = exports.toggleItem = exports.removeItem = exports.addItem = exports.getWishlist = void 0;
const Wishlist_1 = __importDefault(require("../models/Wishlist"));
// GET /api/wishlist - Get user's wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        let wishlist = await Wishlist_1.default.findOne({ userId })
            .populate('items.productId', 'title price originalPrice image stock')
            .lean();
        if (!wishlist) {
            wishlist = { userId, items: [], createdAt: new Date(), updatedAt: new Date() };
        }
        res.json({ success: true, wishlist });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getWishlist = getWishlist;
// POST /api/wishlist/add - Add item to wishlist
const addItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, error: 'Product ID is required' });
        }
        let wishlist = await Wishlist_1.default.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist_1.default({
                userId,
                items: [{ productId, addedAt: new Date() }]
            });
        }
        else {
            const existingItem = wishlist.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                return res.status(400).json({ success: false, error: 'Item already in wishlist' });
            }
            wishlist.items.push({ productId, addedAt: new Date() });
        }
        await wishlist.save();
        const populatedWishlist = await Wishlist_1.default.findById(wishlist._id)
            .populate('items.productId', 'title price originalPrice image stock')
            .lean();
        res.json({ success: true, wishlist: populatedWishlist });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.addItem = addItem;
// DELETE /api/wishlist/remove/:productId - Remove item from wishlist
const removeItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        const { productId } = req.params;
        const wishlist = await Wishlist_1.default.findOneAndUpdate({ userId }, { $pull: { items: { productId } }, $set: { updatedAt: new Date() } }, { new: true }).populate('items.productId', 'title price originalPrice image stock').lean();
        if (!wishlist) {
            return res.status(404).json({ success: false, error: 'Wishlist not found' });
        }
        res.json({ success: true, wishlist });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.removeItem = removeItem;
// POST /api/wishlist/toggle - Toggle item in wishlist
const toggleItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, error: 'Product ID is required' });
        }
        let wishlist = await Wishlist_1.default.findOne({ userId });
        let added = false;
        if (!wishlist) {
            wishlist = new Wishlist_1.default({
                userId,
                items: [{ productId, addedAt: new Date() }]
            });
            added = true;
        }
        else {
            const existingIndex = wishlist.items.findIndex(item => item.productId.toString() === productId);
            if (existingIndex > -1) {
                wishlist.items.splice(existingIndex, 1);
                added = false;
            }
            else {
                wishlist.items.push({ productId, addedAt: new Date() });
                added = true;
            }
        }
        await wishlist.save();
        const populatedWishlist = await Wishlist_1.default.findById(wishlist._id)
            .populate('items.productId', 'title price originalPrice image stock')
            .lean();
        res.json({ success: true, wishlist: populatedWishlist, added });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.toggleItem = toggleItem;
// DELETE /api/wishlist/clear - Clear entire wishlist
const clearWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        await Wishlist_1.default.findOneAndUpdate({ userId }, { $set: { items: [], updatedAt: new Date() } });
        res.json({ success: true, message: 'Wishlist cleared' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.clearWishlist = clearWishlist;
//# sourceMappingURL=wishlistController.js.map