import { Response } from 'express';
import Wishlist from '../models/Wishlist';
import { AuthRequest } from '../middleware/auth';

// GET /api/wishlist - Get user's wishlist
export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    let wishlist = await Wishlist.findOne({ userId })
      .populate('items.productId', 'title price originalPrice image stock')
      .lean();

    if (!wishlist) {
      wishlist = { userId, items: [], createdAt: new Date(), updatedAt: new Date() } as any;
    }

    res.json({ success: true, wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/wishlist/add - Add item to wishlist
export const addItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [{ productId, addedAt: new Date() }]
      });
    } else {
      const existingItem = wishlist.items.find(
        item => item.productId.toString() === productId
      );

      if (existingItem) {
        return res.status(400).json({ success: false, error: 'Item already in wishlist' });
      }

      wishlist.items.push({ productId, addedAt: new Date() });
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('items.productId', 'title price originalPrice image stock')
      .lean();

    res.json({ success: true, wishlist: populatedWishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/wishlist/remove/:productId - Remove item from wishlist
export const removeItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const { productId } = req.params;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } }, $set: { updatedAt: new Date() } },
      { new: true }
    ).populate('items.productId', 'title price originalPrice image stock').lean();

    if (!wishlist) {
      return res.status(404).json({ success: false, error: 'Wishlist not found' });
    }

    res.json({ success: true, wishlist });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/wishlist/toggle - Toggle item in wishlist
export const toggleItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    let wishlist = await Wishlist.findOne({ userId });
    let added = false;

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [{ productId, addedAt: new Date() }]
      });
      added = true;
    } else {
      const existingIndex = wishlist.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingIndex > -1) {
        wishlist.items.splice(existingIndex, 1);
        added = false;
      } else {
        wishlist.items.push({ productId, addedAt: new Date() });
        added = true;
      }
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('items.productId', 'title price originalPrice image stock')
      .lean();

    res.json({ success: true, wishlist: populatedWishlist, added });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/wishlist/clear - Clear entire wishlist
export const clearWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    await Wishlist.findOneAndUpdate(
      { userId },
      { $set: { items: [], updatedAt: new Date() } }
    );

    res.json({ success: true, message: 'Wishlist cleared' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
