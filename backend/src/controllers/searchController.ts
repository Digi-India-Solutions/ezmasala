import { Request, Response } from 'express';
import Spice from '../models/Spice';

// GET /api/search
export const search = async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';

    if (!query.trim()) {
      return res.json([]);
    }

    const spices = await Spice.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
      .select('_id title price image category ratings')
      .limit(10)
      .lean();

    res.json(spices);
  } catch (error: any) {
    res.status(500).json({ error: 'Search failed' });
  }
};
