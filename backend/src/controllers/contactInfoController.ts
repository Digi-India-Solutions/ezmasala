import { Request, Response } from 'express';
import ContactInfo from '../models/ContactInfo';

// GET /api/contact-info - Get contact info (public)
export const get = async (_req: Request, res: Response) => {
  try {
    let contactInfo = await ContactInfo.findOne().lean();

    if (!contactInfo) {
      await ContactInfo.create({});
      contactInfo = await ContactInfo.findOne().lean() as typeof contactInfo;
    }

    res.json({ success: true, contactInfo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/contact-info - Update contact info (admin)
export const update = async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      tagline,
      email,
      phone,
      whatsapp,
      address,
      city,
      state,
      pincode,
      country,
      businessHours
    } = req.body;

    let contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      contactInfo = new ContactInfo({
        companyName,
        tagline,
        email,
        phone,
        whatsapp,
        address,
        city,
        state,
        pincode,
        country,
        businessHours
      });
    } else {
      if (companyName) contactInfo.companyName = companyName;
      if (tagline !== undefined) contactInfo.tagline = tagline;
      if (email) contactInfo.email = email;
      if (phone) contactInfo.phone = phone;
      if (whatsapp !== undefined) contactInfo.whatsapp = whatsapp;
      if (address) contactInfo.address = address;
      if (city) contactInfo.city = city;
      if (state) contactInfo.state = state;
      if (pincode) contactInfo.pincode = pincode;
      if (country !== undefined) contactInfo.country = country;
      if (businessHours) contactInfo.businessHours = businessHours;
    }

    await contactInfo.save();

    res.json({ success: true, contactInfo });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
