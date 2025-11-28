import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  password: string;
  isSuperAdmin: boolean;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSuperAdmin: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Index for faster lookups
AdminSchema.index({ username: 1 });

export default mongoose.model<IAdmin>('Admin', AdminSchema);
