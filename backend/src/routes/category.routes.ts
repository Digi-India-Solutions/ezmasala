import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';

const router = Router();

// Public routes
router.get('/', categoryController.getAll);

export default router;
