import { Router } from 'express';
import multer from 'multer';
import * as uploadController from '../controllers/uploadController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Protected routes (Admin only)
// JSON body upload (base64)
router.post('/', authenticate, requireAdmin, uploadController.upload);

// Multipart form data upload
router.post('/file', authenticate, requireAdmin, upload.single('file'), uploadController.uploadMultipart);

export default router;
