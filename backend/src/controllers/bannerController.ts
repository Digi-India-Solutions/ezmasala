import { Request, Response } from 'express';
import Banner from '../models/Banner';
import { uploadToCloudinary } from '../config/cloudinary';

// GET /api/banners
// Query params: ?all=true to get all banners (for admin), default returns only active banners
export const getAll = async (req: Request, res: Response) => {
  try {
    const { all } = req.query;

    // If all=true, return all banners (for admin panel)
    // Otherwise, return only active banners (for frontend)
    const query = all === 'true' ? {} : { isActive: true };

    const banners = await Banner.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .lean();
    res.json({ banners });
  } catch (error: any) {
    console.error('Failed to fetch banners:', error);
    res.status(500).json({
      error: 'Failed to fetch banners',
      details: error.message
    });
  }
};

// POST /api/banners
export const create = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    let imageUrl = body.image;

    // Upload to Cloudinary if base64
    if (body.image && body.image.startsWith('data:')) {
      imageUrl = await uploadToCloudinary(body.image, 'banners');
    }

    const banner = await Banner.create({
      image: imageUrl,
      priority: body.priority || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    res.status(201).json({ banner });
  } catch (error: any) {
    console.error('Failed to create banner:', error);
    res.status(500).json({
      error: 'Failed to create banner',
      details: error.message
    });
  }
};

// PUT /api/banners/:id
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const banner = await Banner.findByIdAndUpdate(
      id,
      {
        priority: body.priority,
        isActive: body.isActive
      },
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json({ banner });
  } catch (error: any) {
    console.error('Failed to update banner:', error);
    res.status(500).json({
      error: 'Failed to update banner',
      details: error.message
    });
  }
};

// DELETE /api/banners/:id
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete banner:', error);
    res.status(500).json({
      error: 'Failed to delete banner',
      details: error.message
    });
  }
};
