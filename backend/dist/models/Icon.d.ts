import mongoose, { Document } from 'mongoose';
export interface IIcon extends Document {
    id: string;
    label: string;
    icon: string;
    isActive: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<IIcon, {}, {}, {}, mongoose.Document<unknown, {}, IIcon, {}, {}> & IIcon & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Icon.d.ts.map