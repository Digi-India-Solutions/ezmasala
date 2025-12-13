import mongoose, { Document } from 'mongoose';
export interface IWishlistItem {
    productId: mongoose.Types.ObjectId;
    addedAt: Date;
}
export interface IWishlist extends Document {
    userId: mongoose.Types.ObjectId;
    items: IWishlistItem[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IWishlist, {}, {}, {}, mongoose.Document<unknown, {}, IWishlist, {}, {}> & IWishlist & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Wishlist.d.ts.map