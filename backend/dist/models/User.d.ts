import mongoose, { Document } from 'mongoose';
export interface IAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
}
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    addresses: IAddress[];
    createdAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map