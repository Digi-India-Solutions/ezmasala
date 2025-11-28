import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import spiceRoutes from './spice.routes';
import reviewRoutes from './review.routes';
import orderRoutes from './order.routes';
import bannerRoutes from './banner.routes';
import blogRoutes from './blog.routes';
import cookRoutes from './cook.routes';
import videoRoutes from './video.routes';
import iconRoutes from './icon.routes';
import dealRoutes from './deal.routes';
import contactRoutes from './contact.routes';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import searchRoutes from './search.routes';
import uploadRoutes from './upload.routes';
import razorpayRoutes from './razorpay.routes';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

// Resource routes
router.use('/spices', spiceRoutes);
router.use('/reviews', reviewRoutes);
router.use('/orders', orderRoutes);
router.use('/banners', bannerRoutes);
router.use('/blogs', blogRoutes);
router.use('/cooks', cookRoutes);
router.use('/videos', videoRoutes);
router.use('/icons', iconRoutes);
router.use('/deals', dealRoutes);
router.use('/contacts', contactRoutes);

// User routes
router.use('/users', userRoutes);
router.use('/user', userRoutes); // Alias for /user/:id routes

// Utility routes
router.use('/categories', categoryRoutes);
router.use('/search', searchRoutes);
router.use('/upload', uploadRoutes);

// Payment routes
router.use('/razorpay', razorpayRoutes);

// Seed route (for development)
router.get('/seed', async (req, res) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
