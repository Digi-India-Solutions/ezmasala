import { Router } from 'express';
import * as spiceController from '../controllers/spiceController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Update review featured status (Admin only)
router.put('/:spiceId/:reviewIndex', authenticate, requireAdmin, spiceController.updateReviewFeatured);

export default router;
