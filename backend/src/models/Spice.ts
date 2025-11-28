import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  userId: string;
  userName: string;
  rating: number;
  text: string;
  featured: boolean;
  createdAt: Date;
}

export interface ISpice extends Document {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string[];
  stock: number;
  ratings: number;
  icons: string[];
  reviews: IReview[];
  createdAt: Date;
}

const ReviewSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const SpiceSchema = new Schema<ISpice>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  category: { type: [String], required: true, default: [] },
  stock: { type: Number, required: true, default: 0 },
  ratings: { type: Number, default: 0 },
  icons: { type: [String], default: [] },
  reviews: { type: [ReviewSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
SpiceSchema.index({ category: 1 });
SpiceSchema.index({ ratings: -1 });
SpiceSchema.index({ createdAt: -1 });
SpiceSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.model<ISpice>('Spice', SpiceSchema);
