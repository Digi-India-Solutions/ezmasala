import mongoose, { Document } from 'mongoose';
export interface IOrderItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
}
export interface IOrderAddress {
    name?: string;
    phone?: string;
    addressLine?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    pincode?: string;
    country?: string;
}
export interface IOrder extends Document {
    orderId: string;
    userId?: mongoose.Types.ObjectId | null;
    items: IOrderItem[];
    address: IOrderAddress;
    subtotal: number;
    tax: number;
    total: number;
    discount?: number;
    couponCode?: string | null;
    paymentMethod: 'cod' | 'razorpay';
    paymentStatus: 'pending' | 'paid' | 'failed';
    razorpayOrderId?: string | null;
    razorpayPaymentId?: string | null;
    razorpaySignature?: string | null;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    cancellationRequested: boolean;
    cancellationReason?: string;
    cancellationStatus: 'none' | 'pending' | 'approved' | 'rejected';
    cancellationRequestedAt?: Date;
    cancellationProcessedAt?: Date;
    createdAt: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map