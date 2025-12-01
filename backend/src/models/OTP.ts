import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: Date;
  expiresAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Auto-delete expired OTPs
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster email lookups
OTPSchema.index({ email: 1 });

export default mongoose.model<IOTP>('OTP', OTPSchema);
