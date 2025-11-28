import { Request, Response } from 'express';
import Blog from '../models/Blog';
import { uploadToCloudinary } from '../config/cloudinary';

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// GET /api/blogs
export const getAll = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/blogs/:id
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).lean();
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// GET /api/blogs/slug/:slug
export const getBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug }).lean();
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// POST /api/blogs
export const create = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let imageUrl = body.image;

    if (body.image && body.image.startsWith('data:')) {
      imageUrl = await uploadToCloudinary(body.image, 'blogs');
    }

    const slug = generateSlug(body.title);
    const blog = await Blog.create({ ...body, image: imageUrl, slug });
    res.status(201).json(blog);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/blogs/:id
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    let imageUrl = body.image;

    if (body.image && body.image.startsWith('data:')) {
      imageUrl = await uploadToCloudinary(body.image, 'blogs');
    }

    const updateData: any = { ...body, image: imageUrl };
    if (body.title) {
      updateData.slug = generateSlug(body.title);
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/blogs/:id
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
