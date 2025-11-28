import { Request, Response } from 'express';
import Video from '../models/Video';

// GET /api/videos
export const getAll = async (req: Request, res: Response) => {
  try {
    const videos = await Video.find()
      .populate('spiceId')
      .sort({ createdAt: -1 })
      .lean();
    res.json(videos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/videos/:id
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate('spiceId').lean();
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// POST /api/videos
export const create = async (req: Request, res: Response) => {
  try {
    const { spiceId, videoUrl, posterUrl } = req.body;
    const video = await Video.create({ spiceId, videoUrl, posterUrl });
    res.status(201).json(video);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/videos/:id
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndUpdate(id, req.body, { new: true });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/videos/:id
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
