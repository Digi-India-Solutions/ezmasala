import { Request, Response } from 'express';
import Spice from '../models/Spice';
import { uploadToCloudinary } from '../config/cloudinary';
import { AuthRequest } from '../middleware/auth';

// GET /api/spices
export const getAll = async (req: Request, res: Response) => {
  try {
    const { category, type } = req.query;

    // Handle bestsellers
    if (type === 'bestsellers') {
      const spices = await Spice.find()
        .sort({ ratings: -1 })
        .limit(8)
        .lean();
      return res.json(spices);
    }

    // Handle category filter
    let filter: any = {};
    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      filter.category = { $in: categories };
    }

    const spices = await Spice.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json(spices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/spices/:id
export const getById = async (req: Request, res: Response) => {
  try {
    const spice = await Spice.findById(req.params.id).lean();
    if (!spice) {
      return res.status(404).json({ error: 'Spice not found' });
    }
    res.json(spice);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// POST /api/spices
export const create = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let imageUrl = body.image;

    // Upload image to Cloudinary if base64
    if (body.image && body.image.startsWith('data:')) {
      imageUrl = await uploadToCloudinary(body.image, 'spices');
    }

    const spice = await Spice.create({
      ratings: 0,
      images: [],
      icons: [],
      ...body,
      image: imageUrl,
    });

    res.status(201).json(spice);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/spices/:id
export const update = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let imageUrl = body.image;

    // Upload image to Cloudinary if base64
    if (body.image && body.image.startsWith('data:')) {
      imageUrl = await uploadToCloudinary(body.image, 'spices');
    }

    const spice = await Spice.findByIdAndUpdate(
      req.params.id,
      { ...body, image: imageUrl },
      { new: true }
    );

    if (!spice) {
      return res.status(404).json({ error: 'Spice not found' });
    }

    res.json(spice);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/spices/:id
export const deleteSpice = async (req: Request, res: Response) => {
  try {
    const spice = await Spice.findByIdAndDelete(req.params.id);
    if (!spice) {
      return res.status(404).json({ error: 'Spice not found' });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// POST /api/spices/:id/reviews
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, userName, rating, text } = req.body;

    if (!userId || !userName || !rating || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const spice = await Spice.findById(req.params.id);
    if (!spice) {
      return res.status(404).json({ error: 'Spice not found' });
    }

    spice.reviews.push({
      userId,
      userName,
      rating,
      text,
      featured: false,
      createdAt: new Date(),
    });

    // Update average rating
    const totalRating = spice.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    spice.ratings = totalRating / spice.reviews.length;

    await spice.save();

    res.json(spice);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// PUT /api/reviews/:spiceId/:reviewIndex
export const updateReviewFeatured = async (req: Request, res: Response) => {
  try {
    const { spiceId, reviewIndex } = req.params;
    const { featured } = req.body;
    const index = parseInt(reviewIndex);

    const spice = await Spice.findById(spiceId);
    if (!spice || !spice.reviews[index]) {
      return res.status(404).json({ error: 'Review not found' });
    }

    spice.reviews[index].featured = featured;
    await spice.save();

    res.json({ spice });
  } catch (error: any) {
    console.error('Failed to update review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};
