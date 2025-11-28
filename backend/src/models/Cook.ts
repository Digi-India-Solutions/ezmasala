import mongoose, { Schema, Document } from 'mongoose';

export interface ICook extends Document {
  title: string;
  steps: string[];
  ingredients: string[];
  image: string;
  category: string;
  slug: string;
  createdAt: Date;
}

const CookSchema = new Schema<ICook>({
  title: { type: String, required: true },
  steps: { type: [String], required: true },
  ingredients: { type: [String], required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Indexes
CookSchema.index({ slug: 1 });
CookSchema.index({ category: 1 });
CookSchema.index({ createdAt: -1 });

export default mongoose.model<ICook>('Cook', CookSchema);
