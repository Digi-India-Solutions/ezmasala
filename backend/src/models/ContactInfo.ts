import mongoose, { Schema, Document } from 'mongoose';

export interface IContactInfo extends Document {
  companyName: string;
  tagline?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  businessHours: string;
  updatedAt: Date;
}

const ContactInfoSchema = new Schema<IContactInfo>({
  companyName: {
    type: String,
    required: true,
    default: 'Shine Exports (India)'
  },
  tagline: {
    type: String,
    default: 'Makers of EZ Masala J & EZ Masala M'
  },
  email: {
    type: String,
    required: true,
    default: 'info@ezmasalaa.com'
  },
  phone: {
    type: String,
    required: true,
    default: '+91-XXXXXXXXXX'
  },
  whatsapp: {
    type: String,
    default: '+91-XXXXXXXXXX'
  },
  address: {
    type: String,
    required: true,
    default: 'B1-236, Naraina Industrial Area, Phase-I'
  },
  city: {
    type: String,
    required: true,
    default: 'New Delhi'
  },
  state: {
    type: String,
    required: true,
    default: 'Delhi'
  },
  pincode: {
    type: String,
    required: true,
    default: '110028'
  },
  country: {
    type: String,
    default: 'India'
  },
  businessHours: {
    type: String,
    required: true,
    default: 'Mon – Sat, 10:00 AM to 6:00 PM (IST)'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ContactInfoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IContactInfo>('ContactInfo', ContactInfoSchema);
