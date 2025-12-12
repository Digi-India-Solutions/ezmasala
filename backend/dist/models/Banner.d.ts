import mongoose, { Document } from 'mongoose';
export interface IBanner extends Document {
    image: string;
    priority: number;
    isActive: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<IBanner, {}, {}, {}, mongoose.Document<unknown, {}, IBanner, {}, {}> & IBanner & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Banner.d.ts.map