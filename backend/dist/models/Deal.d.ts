import mongoose, { Document } from 'mongoose';
export interface IDeal extends Document {
    title: string;
    isActive: boolean;
    priority: number;
    createdAt: Date;
}
declare const _default: mongoose.Model<IDeal, {}, {}, {}, mongoose.Document<unknown, {}, IDeal, {}, {}> & IDeal & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Deal.d.ts.map