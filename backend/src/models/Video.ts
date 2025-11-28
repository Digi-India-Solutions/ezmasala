import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  spiceId: mongoose.Types.ObjectId;
  videoUrl: string;
  posterUrl?: string;
  createdAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  spiceId: { type: Schema.Types.ObjectId, ref: 'Spice', required: true },
  videoUrl: { type: String, required: true },
  posterUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Index for spice video lookups
VideoSchema.index({ spiceId: 1 });
VideoSchema.index({ createdAt: -1 });

export default mongoose.model<IVideo>('Video', VideoSchema);
