import { Router } from 'express';
import * as searchController from '../controllers/searchController';

const router = Router();

// Public routes
router.get('/', searchController.search);

export default router;
