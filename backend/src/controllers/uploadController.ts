import { Request, Response } from 'express';
import { uploadToCloudinary } from '../config/cloudinary';

// POST /api/upload
export const upload = async (req: Request, res: Response) => {
  try {
    const { file, folder = 'general' } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Handle base64 file upload
    const imageUrl = await uploadToCloudinary(file, folder);

    res.json({ url: imageUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Alternative handler for multipart form data
export const uploadMultipart = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const folder = (req.body.folder as string) || 'general';

    // Convert buffer to base64
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const imageUrl = await uploadToCloudinary(base64, folder);

    res.json({ url: imageUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
