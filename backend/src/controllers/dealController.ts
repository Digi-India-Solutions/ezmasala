import { Request, Response } from 'express';
import Deal from '../models/Deal';

// GET /api/deals
export const getAll = async (req: Request, res: Response) => {
  try {
    const deals = await Deal.find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 })
      .lean();
    res.json({ deals });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/deals
export const create = async (req: Request, res: Response) => {
  try {
    const { title, priority, isActive } = req.body;
    const deal = await Deal.create({
      title,
      priority: priority || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json({ deal });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/deals/:id
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, priority, isActive } = req.body;

    const deal = await Deal.findByIdAndUpdate(
      id,
      { title, priority, isActive },
      { new: true }
    );

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json({ deal });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/deals/:id
export const deleteDeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByIdAndDelete(id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
