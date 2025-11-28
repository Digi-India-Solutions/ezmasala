import mongoose, { Schema, Document } from 'mongoose';

export interface IIcon extends Document {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
}

const IconSchema = new Schema<IIcon>({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  icon: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Index
IconSchema.index({ isActive: 1 });

export default mongoose.model<IIcon>('Icon', IconSchema);
