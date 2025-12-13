import mongoose, { Document } from 'mongoose';
export interface IContactInfo extends Document {
    companyName: string;
    tagline?: string;
    email: string;
    phone: string;
    whatsapp?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    businessHours: string;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IContactInfo, {}, {}, {}, mongoose.Document<unknown, {}, IContactInfo, {}, {}> & IContactInfo & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ContactInfo.d.ts.map