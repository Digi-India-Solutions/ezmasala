import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, wishlistController.getWishlist);
router.post('/add', authenticate, wishlistController.addItem);
router.post('/toggle', authenticate, wishlistController.toggleItem);
router.delete('/remove/:productId', authenticate, wishlistController.removeItem);
router.delete('/clear', authenticate, wishlistController.clearWishlist);

export default router;
