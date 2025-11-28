import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  image: string;
  author: string;
  slug: string;
  createdAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Indexes
BlogSchema.index({ slug: 1 });
BlogSchema.index({ createdAt: -1 });

export default mongoose.model<IBlog>('Blog', BlogSchema);
