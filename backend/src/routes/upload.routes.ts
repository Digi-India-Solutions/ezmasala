import { Router } from 'express';
import multer from 'multer';
import * as uploadController from '../controllers/uploadController';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for videos
});

// Upload routes (no auth for now)
// JSON body upload (base64)
router.post('/', uploadController.upload);

// Multipart form data upload
router.post('/file', upload.single('file'), uploadController.uploadMultipart);

export default router;
