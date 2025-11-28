import { Request, Response } from 'express';
import User, { IAddress } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// GET /api/users
export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// GET /api/user/:id
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// POST /api/user/:id/addresses
export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const address = req.body as IAddress;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If new address is default, unset others
    if (address.isDefault) {
      user.addresses.forEach((addr: IAddress) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(address);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/user/:id/addresses
export const updateAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { addresses } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { addresses },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
