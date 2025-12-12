import mongoose, { Document } from 'mongoose';
export interface IVideo extends Document {
    spiceId: mongoose.Types.ObjectId;
    videoUrl: string;
    posterUrl?: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IVideo, {}, {}, {}, mongoose.Document<unknown, {}, IVideo, {}, {}> & IVideo & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Video.d.ts.map