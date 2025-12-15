import { Request, Response } from 'express';
import User, { IAddress } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { sendEmail, getProfileUpdateConfirmationTemplate } from '../utils/email';

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

// PUT /api/user/:id/profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone } = req.body;

    // Verify the user making the request is the owner or admin
    if (req.user?.id !== id && req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this profile' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Track changes for email notification
    const changes: string[] = [];
    const oldEmail = user.email;

    // Update fields and track changes
    if (firstName && firstName !== user.firstName) {
      changes.push(`First Name updated to: ${firstName}`);
      user.firstName = firstName;
    }

    if (lastName && lastName !== user.lastName) {
      changes.push(`Last Name updated to: ${lastName}`);
      user.lastName = lastName;
    }

    if (email && email !== user.email) {
      // Check if new email already exists
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      changes.push(`Email updated to: ${email}`);
      user.email = email;
    }

    if (phone !== undefined && phone !== user.phone) {
      if (phone) {
        changes.push(`Phone Number updated to: ${phone}`);
      } else {
        changes.push(`Phone Number removed`);
      }
      user.phone = phone;
    }

    // Save user
    await user.save();

    // Send confirmation email to both old and new email if email was changed
    if (changes.length > 0) {
      const userName = `${user.firstName} ${user.lastName}`;
      const emailHtml = getProfileUpdateConfirmationTemplate(userName, changes);

      // Send to new email
      await sendEmail({
        to: user.email,
        subject: 'Profile Updated - EZ Masala',
        html: emailHtml,
      });

      // If email changed, notify the old email as well
      if (email && email !== oldEmail) {
        await sendEmail({
          to: oldEmail,
          subject: 'Profile Email Changed - EZ Masala',
          html: emailHtml,
        });
      }
    }

    // Return updated user without password
    const updatedUser = await User.findById(id).select('-password');
    res.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully. Confirmation email sent.'
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
