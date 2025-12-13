"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.validate = exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const Coupon_1 = __importDefault(require("../models/Coupon"));
// GET /api/coupons - Get all coupons (admin)
const getAll = async (req, res) => {
    try {
        const coupons = await Coupon_1.default.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, coupons });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getAll = getAll;
// GET /api/coupons/:id - Get single coupon
const getById = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.findById(req.params.id).lean();
        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Coupon not found' });
        }
        res.json({ success: true, coupon });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getById = getById;
// POST /api/coupons - Create coupon (admin)
const create = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, maxDiscountAmount, usageLimit, validFrom, validUntil, isActive } = req.body;
        if (!code || !discountType || discountValue === undefined || !validFrom || !validUntil) {
            return res.status(400).json({
                success: false,
                error: 'Code, discount type, discount value, valid from and valid until are required'
            });
        }
        const existingCoupon = await Coupon_1.default.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ success: false, error: 'Coupon code already exists' });
        }
        const coupon = await Coupon_1.default.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minOrderAmount: minOrderAmount || 0,
            maxDiscountAmount: maxDiscountAmount || null,
            usageLimit: usageLimit || null,
            validFrom: new Date(validFrom),
            validUntil: new Date(validUntil),
            isActive: isActive !== false
        });
        res.status(201).json({ success: true, coupon });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.create = create;
// PUT /api/coupons/:id - Update coupon (admin)
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase();
            const existingCoupon = await Coupon_1.default.findOne({
                code: updateData.code,
                _id: { $ne: id }
            });
            if (existingCoupon) {
                return res.status(400).json({ success: false, error: 'Coupon code already exists' });
            }
        }
        const coupon = await Coupon_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });
        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Coupon not found' });
        }
        res.json({ success: true, coupon });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.update = update;
// DELETE /api/coupons/:id - Delete coupon (admin)
const remove = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Coupon not found' });
        }
        res.json({ success: true, message: 'Coupon deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.remove = remove;
// POST /api/coupons/validate - Validate and apply coupon (public)
const validate = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, error: 'Coupon code is required' });
        }
        const coupon = await Coupon_1.default.findOne({ code: code.toUpperCase() });
        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Invalid coupon code' });
        }
        if (!coupon.isActive) {
            return res.status(400).json({ success: false, error: 'This coupon is no longer active' });
        }
        const now = new Date();
        if (now < coupon.validFrom) {
            return res.status(400).json({ success: false, error: 'This coupon is not yet valid' });
        }
        if (now > coupon.validUntil) {
            return res.status(400).json({ success: false, error: 'This coupon has expired' });
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, error: 'This coupon has reached its usage limit' });
        }
        if (orderAmount && orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                error: `Minimum order amount of ₹${coupon.minOrderAmount} required`
            });
        }
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
            }
        }
        else {
            discountAmount = coupon.discountValue;
        }
        res.json({
            success: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                maxDiscountAmount: coupon.maxDiscountAmount
            },
            discountAmount: Math.round(discountAmount * 100) / 100
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.validate = validate;
// POST /api/coupons/apply - Apply coupon (increment usage count)
const apply = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, error: 'Coupon code is required' });
        }
        const coupon = await Coupon_1.default.findOneAndUpdate({ code: code.toUpperCase() }, { $inc: { usedCount: 1 } }, { new: true });
        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Coupon not found' });
        }
        res.json({ success: true, message: 'Coupon applied successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.apply = apply;
//# sourceMappingURL=couponController.js.map