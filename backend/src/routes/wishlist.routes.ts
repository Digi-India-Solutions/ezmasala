import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, wishlistController.getWishlist);
router.post('/add', optionalAuth, wishlistController.addItem);
router.post('/toggle', optionalAuth, wishlistController.toggleItem);
router.delete('/remove/:productId', optionalAuth, wishlistController.removeItem);
router.delete('/clear', optionalAuth, wishlistController.clearWishlist);

export default router;
