import { Request, Response } from 'express';
import Cook from '../models/Cook';
import { uploadToCloudinary } from '../config/cloudinary';

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// GET /api/cooks
export const getAll = async (req: Request, res: Response) => {
  try {
    const cooks = await Cook.find().sort({ createdAt: -1 }).lean();
    res.json(cooks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/cooks/slug/:slug
export const getBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const cook = await Cook.findOne({ slug }).lean();
    if (!cook) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(cook);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// POST /api/cooks
export const create = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let imageUrl = body.image;

    if (body.image && body.image.startsWith('data:')) {
      imageUrl = await uploadToCloudinary(body.image, 'cooks');
    }

    const slug = generateSlug(body.title);
    const cook = await Cook.create({ ...body, image: imageUrl, slug });
    res.status(201).json(cook);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/cooks/:id
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    let imageUrl = body.image;

    if (body.image && body.image.startsWith('data:')) {
      imageUrl = await uploadToCloudinary(body.image, 'cooks');
    }

    const updateData: any = { ...body, image: imageUrl };
    if (body.title) {
      updateData.slug = generateSlug(body.title);
    }

    const cook = await Cook.findByIdAndUpdate(id, updateData, { new: true });
    if (!cook) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(cook);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/cooks/:id
export const deleteCook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cook = await Cook.findByIdAndDelete(id);
    if (!cook) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
