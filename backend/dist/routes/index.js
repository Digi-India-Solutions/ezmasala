"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const spice_routes_1 = __importDefault(require("./spice.routes"));
const review_routes_1 = __importDefault(require("./review.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const banner_routes_1 = __importDefault(require("./banner.routes"));
const blog_routes_1 = __importDefault(require("./blog.routes"));
const cook_routes_1 = __importDefault(require("./cook.routes"));
const video_routes_1 = __importDefault(require("./video.routes"));
const icon_routes_1 = __importDefault(require("./icon.routes"));
const deal_routes_1 = __importDefault(require("./deal.routes"));
const contact_routes_1 = __importDefault(require("./contact.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const search_routes_1 = __importDefault(require("./search.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
const razorpay_routes_1 = __importDefault(require("./razorpay.routes"));
const coupon_routes_1 = __importDefault(require("./coupon.routes"));
const wishlist_routes_1 = __importDefault(require("./wishlist.routes"));
const contactInfo_routes_1 = __importDefault(require("./contactInfo.routes"));
const router = (0, express_1.Router)();
// Auth routes
router.use('/auth', auth_routes_1.default);
router.use('/admin', admin_routes_1.default);
// Resource routes
router.use('/spices', spice_routes_1.default);
router.use('/reviews', review_routes_1.default);
router.use('/orders', order_routes_1.default);
router.use('/banners', banner_routes_1.default);
router.use('/blogs', blog_routes_1.default);
router.use('/cooks', cook_routes_1.default);
router.use('/videos', video_routes_1.default);
router.use('/icons', icon_routes_1.default);
router.use('/deals', deal_routes_1.default);
router.use('/contacts', contact_routes_1.default);
router.use('/coupons', coupon_routes_1.default);
router.use('/wishlist', wishlist_routes_1.default);
router.use('/contact-info', contactInfo_routes_1.default);
// User routes
router.use('/users', user_routes_1.default);
router.use('/user', user_routes_1.default); // Alias for /user/:id routes
// Utility routes
router.use('/categories', category_routes_1.default);
router.use('/search', search_routes_1.default);
router.use('/upload', upload_routes_1.default);
// Payment routes
router.use('/razorpay', razorpay_routes_1.default);
// Seed route (for development ONLY - disabled in production)
router.get('/seed', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Seed route is disabled in production' });
    }
    try {
        const bcrypt = require('bcryptjs');
        const Admin = require('../models/Admin').default;
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            return res.json({ message: 'Admin already exists' });
        }
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.create({
            username: 'admin',
            password: hashedPassword,
            isSuperAdmin: true,
        });
        res.json({ message: 'Admin seeded successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map