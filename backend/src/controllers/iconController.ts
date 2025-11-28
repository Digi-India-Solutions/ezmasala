import { Request, Response } from 'express';
import Icon from '../models/Icon';

// GET /api/icons
export const getAll = async (req: Request, res: Response) => {
  try {
    const icons = await Icon.find().sort({ createdAt: 1 }).lean();
    res.json(icons);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/icons/:id
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const icon = await Icon.findById(id).lean();
    if (!icon) {
      return res.status(404).json({ error: 'Icon not found' });
    }
    res.json(icon);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// POST /api/icons
export const create = async (req: Request, res: Response) => {
  try {
    const icon = await Icon.create(req.body);
    res.status(201).json(icon);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/icons/:id
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const icon = await Icon.findByIdAndUpdate(id, req.body, { new: true });
    if (!icon) {
      return res.status(404).json({ error: 'Icon not found' });
    }
    res.json(icon);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/icons/:id
export const deleteIcon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const icon = await Icon.findByIdAndDelete(id);
    if (!icon) {
      return res.status(404).json({ error: 'Icon not found' });
    }
    res.json(icon);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
