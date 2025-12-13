"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.get = void 0;
const ContactInfo_1 = __importDefault(require("../models/ContactInfo"));
// GET /api/contact-info - Get contact info (public)
const get = async (_req, res) => {
    try {
        let contactInfo = await ContactInfo_1.default.findOne().lean();
        if (!contactInfo) {
            await ContactInfo_1.default.create({});
            contactInfo = await ContactInfo_1.default.findOne().lean();
        }
        res.json({ success: true, contactInfo });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.get = get;
// PUT /api/contact-info - Update contact info (admin)
const update = async (req, res) => {
    try {
        const { companyName, tagline, email, phone, whatsapp, address, city, state, pincode, country, businessHours } = req.body;
        let contactInfo = await ContactInfo_1.default.findOne();
        if (!contactInfo) {
            contactInfo = new ContactInfo_1.default({
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
        }
        else {
            if (companyName)
                contactInfo.companyName = companyName;
            if (tagline !== undefined)
                contactInfo.tagline = tagline;
            if (email)
                contactInfo.email = email;
            if (phone)
                contactInfo.phone = phone;
            if (whatsapp !== undefined)
                contactInfo.whatsapp = whatsapp;
            if (address)
                contactInfo.address = address;
            if (city)
                contactInfo.city = city;
            if (state)
                contactInfo.state = state;
            if (pincode)
                contactInfo.pincode = pincode;
            if (country !== undefined)
                contactInfo.country = country;
            if (businessHours)
                contactInfo.businessHours = businessHours;
        }
        await contactInfo.save();
        res.json({ success: true, contactInfo });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.update = update;
//# sourceMappingURL=contactInfoController.js.map