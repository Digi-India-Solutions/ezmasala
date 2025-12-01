import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  mobile?: string;
  city?: string;
  queryType?: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String },
  city: { type: String },
  queryType: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Index for listing
ContactSchema.index({ createdAt: -1 });

export default mongoose.model<IContact>('Contact', ContactSchema);
