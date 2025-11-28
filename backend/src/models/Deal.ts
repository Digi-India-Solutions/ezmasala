import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  isActive: boolean;
  priority: number;
  createdAt: Date;
}

const DealSchema = new Schema<IDeal>({
  title: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  strict: true,
  strictQuery: false
});

// Index for active deals queries
DealSchema.index({ isActive: 1, priority: -1 });

export default mongoose.model<IDeal>('Deal', DealSchema);
