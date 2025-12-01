import { Request, Response } from 'express';
import Contact from '../models/Contact';
import { sendEmail, getContactFormEmailTemplate } from '../utils/email';

// GET /api/contacts
export const getAll = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/contacts/:id
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id).lean();
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// POST /api/contacts
export const create = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, city, queryType, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({ name, email, mobile, city, queryType, message });

    // Send email notification to website admin
    const notificationEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_FROM_EMAIL;
    if (notificationEmail) {
      const isBulkEnquiry = queryType === 'bulk';
      const emailSubject = isBulkEnquiry
        ? `New Bulk Enquiry from ${name} - EZ Masala`
        : `New Contact Form Submission from ${name} - EZ Masala`;

      const emailHtml = getContactFormEmailTemplate({
        name,
        email,
        mobile,
        city,
        queryType,
        message
      });

      // Send email asynchronously (don't wait for it to complete)
      sendEmail({
        to: notificationEmail,
        subject: emailSubject,
        html: emailHtml
      }).catch(err => console.error('Failed to send contact notification email:', err));
    }

    res.status(201).json({ success: true, contact });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/contacts/:id
export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
