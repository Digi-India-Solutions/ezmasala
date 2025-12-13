import mongoose, { Document } from 'mongoose';
export interface ICoupon extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    usedCount: number;
    validFrom: Date;
    validUntil: Date;
    isActive: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<ICoupon, {}, {}, {}, mongoose.Document<unknown, {}, ICoupon, {}, {}> & ICoupon & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Coupon.d.ts.map