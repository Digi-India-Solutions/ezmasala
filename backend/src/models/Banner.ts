import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  image: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
}

const BannerSchema = new Schema<IBanner>({
  image: { type: String, required: true },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, {
  strict: true,
  strictQuery: false
});

// Index for faster active banner queries
BannerSchema.index({ isActive: 1, priority: -1 });

export default mongoose.model<IBanner>('Banner', BannerSchema);
