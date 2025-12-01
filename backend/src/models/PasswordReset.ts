import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordReset extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Auto-delete expired OTPs
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster email lookups
PasswordResetSchema.index({ email: 1 });

export default mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema);
