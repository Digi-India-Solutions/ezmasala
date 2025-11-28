import { Request, Response } from 'express';
import Spice from '../models/Spice';

// GET /api/categories
export const getAll = async (req: Request, res: Response) => {
  try {
    // Get all unique categories from spices
    const categories = await Spice.distinct('category');

    // Flatten the array since category is an array field and return unique values
    const uniqueCategories = [...new Set(categories.flat())].filter(Boolean);

    // Format categories with additional info
    const formattedCategories = uniqueCategories.map((cat: string, index: number) => ({
      id: String(index + 1),
      name: cat.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      slug: cat,
    }));

    res.json({ categories: formattedCategories });
  } catch (error: any) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      details: error.message
    });
  }
};
