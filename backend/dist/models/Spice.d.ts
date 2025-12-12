import mongoose, { Document } from 'mongoose';
export interface IReview {
    userId: string;
    userName: string;
    rating: number;
    text: string;
    featured: boolean;
    createdAt: Date;
}
export interface ISpice extends Document {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    images: string[];
    category: string[];
    stock: number;
    ratings: number;
    icons: string[];
    reviews: IReview[];
    createdAt: Date;
}
declare const _default: mongoose.Model<ISpice, {}, {}, {}, mongoose.Document<unknown, {}, ISpice, {}, {}> & ISpice & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Spice.d.ts.map