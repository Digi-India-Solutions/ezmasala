import mongoose, { Document } from 'mongoose';
export interface IBlog extends Document {
    title: string;
    content: string;
    image: string;
    author: string;
    slug: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IBlog, {}, {}, {}, mongoose.Document<unknown, {}, IBlog, {}, {}> & IBlog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Blog.d.ts.map