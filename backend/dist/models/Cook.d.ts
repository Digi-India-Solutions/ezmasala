import mongoose, { Document } from 'mongoose';
export interface ICook extends Document {
    title: string;
    steps: string[];
    ingredients: string[];
    image: string;
    category: string;
    slug: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<ICook, {}, {}, {}, mongoose.Document<unknown, {}, ICook, {}, {}> & ICook & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Cook.d.ts.map